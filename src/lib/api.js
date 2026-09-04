import { getCached, setCached } from '../utils/cache';

const ANILIST_URL = 'https://graphql.anilist.co';

// ---------------------------------------------------------------------------
// Core GraphQL fetcher with retry + caching
// AniList rate limit is 90 requests/minute. No request queue needed since
// we cache aggressively, but we still back off on 429s.
// ---------------------------------------------------------------------------

// Shared anime fields used across all queries
const ANIME_FIELDS = `
  id
  idMal
  title {
    romaji
    english
    native
  }
  coverImage {
    extraLarge
    large
  }
  bannerImage
  description(asHtml: false)
  episodes
  duration
  status
  format
  source
  meanScore
  popularity
  rankings {
    rank
    type
    allTime
  }
  genres
  studios(isMain: true) {
    nodes {
      name
    }
  }
  trailer {
    id
    site
  }
  startDate {
    year
    month
    day
  }
  endDate {
    year
    month
    day
  }
  averageScore
  season
  seasonYear
`;

async function gqlFetch(query, variables = {}, cacheKey = null, maxRetries = 3) {
  const key = cacheKey || JSON.stringify({ query, variables });

  const cached = getCached(key);
  if (cached) return cached;

  const performFetch = async (attempt = 0) => {
    try {
      const response = await fetch(ANILIST_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      });

      if (response.status === 429 || response.status === 503 || response.status === 502 || response.status === 504) {
        if (attempt < maxRetries) {
          const retryAfter = parseInt(response.headers.get('Retry-After') || '0', 10);
          const backoff = retryAfter
            ? retryAfter * 1000
            : Math.min(1000 * Math.pow(2, attempt) + Math.random() * 300, 10000);
          console.warn(`AniList responded ${response.status}. Retry ${attempt + 1}/${maxRetries} in ${Math.round(backoff)}ms`);
          await new Promise(r => setTimeout(r, backoff));
          return performFetch(attempt + 1);
        }
        throw new Error(`Server rate limit or timeout (${response.status}). Please try again.`);
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const json = await response.json();

      if (json.errors) {
        const msg = json.errors[0]?.message || 'GraphQL error';
        // 404-equivalent in AniList
        if (json.errors[0]?.status === 404) throw new Error(`API Error: 404`);
        throw new Error(msg);
      }

      return json;
    } catch (error) {
      if (attempt < maxRetries && !error.message?.includes('API Error: 404')) {
        const backoff = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 300, 8000);
        console.warn(`Fetch error (${error.message}). Retry ${attempt + 1}/${maxRetries} in ${Math.round(backoff)}ms`);
        await new Promise(r => setTimeout(r, backoff));
        return performFetch(attempt + 1);
      }
      throw error;
    }
  };

  const fetchPromise = performFetch(0);
  setCached(key, fetchPromise);
  return fetchPromise;
}

// ---------------------------------------------------------------------------
// Normalizer — converts an AniList media node into the Jikan-compatible shape
// expected by every component in the app.
// ---------------------------------------------------------------------------
function normalizeAnime(media) {
  if (!media) return null;

  // Prefer idMal for routing continuity (same URL shape as before).
  // Fall back to AniList id if MAL id is unavailable.
  const mal_id = media.idMal || media.id;

  const title = media.title?.romaji || media.title?.english || '';
  const title_english = media.title?.english || media.title?.romaji || '';
  const title_japanese = media.title?.native || '';

  const images = {
    jpg: {
      large_image_url: media.coverImage?.extraLarge || media.coverImage?.large || '',
      image_url: media.coverImage?.large || '',
    },
    webp: {
      large_image_url: media.coverImage?.extraLarge || media.coverImage?.large || '',
      image_url: media.coverImage?.large || '',
    },
  };

  // AniList score is 0–100; convert to 0–10 to match Jikan
  const score = media.meanScore ? parseFloat((media.meanScore / 10).toFixed(2)) : null;

  // Extract overall all-time rank from rankings array
  const rankObj = (media.rankings || []).find(r => r.type === 'RATED' && r.allTime);
  const rank = rankObj?.rank || null;

  const popularity = media.popularity || null;
  // AniList doesn't expose member counts directly; use popularity as a proxy
  const members = media.popularity || 0;

  const episodes = media.episodes || null;

  // AniList duration is per-episode in minutes
  const duration = media.duration ? `${media.duration} min per ep` : null;

  // Map AniList status → Jikan-style status string
  const STATUS_MAP = {
    FINISHED: 'Finished Airing',
    RELEASING: 'Currently Airing',
    NOT_YET_RELEASED: 'Not yet aired',
    CANCELLED: 'Cancelled',
    HIATUS: 'On Hiatus',
  };
  const status = STATUS_MAP[media.status] || media.status || '';

  // Map AniList format → Jikan type string
  const FORMAT_MAP = {
    TV: 'TV',
    TV_SHORT: 'TV',
    MOVIE: 'Movie',
    SPECIAL: 'Special',
    OVA: 'OVA',
    ONA: 'ONA',
    MUSIC: 'Music',
  };
  const type = FORMAT_MAP[media.format] || media.format || '';

  // Map AniList source → Jikan source string
  const SOURCE_MAP = {
    MANGA: 'Manga',
    LIGHT_NOVEL: 'Light novel',
    VISUAL_NOVEL: 'Visual novel',
    VIDEO_GAME: 'Video game',
    OTHER: 'Other',
    NOVEL: 'Novel',
    DOUJINSHI: 'Doujinshi',
    ANIME: 'Original',
    ORIGINAL: 'Original',
    COMIC: 'Comic',
    GAME: 'Game',
    LIVE_ACTION: 'Live action',
    MULTIMEDIA_PROJECT: 'Multimedia project',
    PICTURE_BOOK: 'Picture book',
  };
  const source = SOURCE_MAP[media.source] || media.source || '';

  // Genres: give each a stable pseudo-id so key={genre.mal_id} doesn't break
  const genres = (media.genres || []).map((name, i) => ({
    mal_id: i + 1, // stable index-based id; not used for routing
    name,
  }));

  const studios = (media.studios?.nodes || []).map(s => ({ name: s.name }));

  // Build trailer embed URL from AniList trailer info
  let trailer = null;
  if (media.trailer?.id) {
    if (media.trailer.site === 'youtube') {
      trailer = {
        embed_url: `https://www.youtube.com/embed/${media.trailer.id}`,
      };
    } else if (media.trailer.site === 'dailymotion') {
      trailer = {
        embed_url: `https://www.dailymotion.com/embed/video/${media.trailer.id}`,
      };
    }
  }

  const synopsis = media.description
    ? media.description.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/gi, ' ').trim()
    : null;

  // Build a human-readable aired string from startDate / endDate
  const formatDate = (d) => {
    if (!d || !d.year) return null;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = d.month ? months[d.month - 1] : '';
    const day = d.day ? ` ${d.day},` : '';
    return `${month}${day} ${d.year}`.trim();
  };
  const startStr = formatDate(media.startDate);
  const endStr = formatDate(media.endDate);
  const airedString = startStr
    ? endStr
      ? `${startStr} to ${endStr}`
      : `${startStr} to ?`
    : null;
  const aired = { string: airedString };

  // AniList exposes averageScore (0–100); use it as a proxy for scored_by display
  // (actual voter count isn't in the API — we leave it null so the UI hides it)
  const scored_by = null;

  // AniList doesn't expose an age rating on the public API
  const rating = null;

  return {
    mal_id,
    title,
    title_english,
    title_japanese,
    images,
    score,
    rank,
    popularity,
    members,
    episodes,
    duration,
    status,
    type,
    source,
    genres,
    studios,
    trailer,
    synopsis,
    aired,
    scored_by,
    rating,
    // Preserve the raw AniList id for internal use
    anilist_id: media.id,
  };
}

function normalizePage(mediaList) {
  return (mediaList || []).map(normalizeAnime).filter(Boolean);
}

// ---------------------------------------------------------------------------
// Public API — same signatures as before
// ---------------------------------------------------------------------------

export async function getTopAnime(page = 1, limit = 25) {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: SCORE_DESC, isAdult: false) {
          ${ANIME_FIELDS}
        }
      }
    }
  `;
  const cacheKey = `top:${page}:${limit}`;
  const json = await gqlFetch(query, { page, perPage: limit }, cacheKey);
  return { data: normalizePage(json.data?.Page?.media) };
}

export async function getAnimeById(id) {
  // id here may be a MAL id (legacy routes) or an AniList id.
  // Try idMal first, then fall back to AniList id.
  const query = `
    query ($idMal: Int) {
      Media(idMal: $idMal, type: ANIME) {
        ${ANIME_FIELDS}
      }
    }
  `;
  const cacheKey = `detail:mal:${id}`;

  try {
    const json = await gqlFetch(query, { idMal: id }, cacheKey);
    return { data: normalizeAnime(json.data?.Media) };
  } catch (err) {
    // If MAL id lookup fails, try AniList native id
    if (err.message?.includes('404') || err.message?.includes('Not Found')) {
      const fallbackQuery = `
        query ($id: Int) {
          Media(id: $id, type: ANIME) {
            ${ANIME_FIELDS}
          }
        }
      `;
      const fallbackKey = `detail:al:${id}`;
      const json = await gqlFetch(fallbackQuery, { id }, fallbackKey);
      return { data: normalizeAnime(json.data?.Media) };
    }
    throw err;
  }
}

export async function searchAnime(query, page = 1, limit = 25, options = {}) {
  // Map Jikan-style filter options to AniList equivalents
  const variables = { page, perPage: limit };

  const gql = `
    query (
      $page: Int,
      $perPage: Int,
      $search: String,
      $genre: String,
      $format: MediaFormat,
      $status: MediaStatus,
      $minimumTagRank: Int,
      $sort: [MediaSort]
    ) {
      Page(page: $page, perPage: $perPage) {
        media(
          type: ANIME
          isAdult: false
          search: $search
          genre: $genre
          format: $format
          status: $status
          minimumTagRank: $minimumTagRank
          sort: $sort
        ) {
          ${ANIME_FIELDS}
        }
      }
    }
  `;

  if (query) variables.search = query;

  if (options.genre && GENRE_MAP[options.genre]) {
    variables.genre = options.genre;
  }

  if (options.type && options.type !== 'all') {
    const FORMAT_MAP = {
      tv: 'TV',
      movie: 'MOVIE',
      ova: 'OVA',
      ona: 'ONA',
      special: 'SPECIAL',
    };
    const fmt = FORMAT_MAP[options.type.toLowerCase()];
    if (fmt) variables.format = fmt;
  }

  if (options.status && options.status !== 'all') {
    const STATUS_MAP = {
      airing: 'RELEASING',
      complete: 'FINISHED',
      upcoming: 'NOT_YET_RELEASED',
    };
    const st = STATUS_MAP[options.status.toLowerCase()];
    if (st) variables.status = st;
  }

  if (options.min_score && options.min_score !== 'any') {
    const scoreVal = parseInt(options.min_score);
    if (!isNaN(scoreVal)) {
      // AniList scores are 0–100; convert the Jikan min_score (0–10) threshold
      variables.minimumTagRank = scoreVal * 10;
    }
  }

  // Sort mapping
  const SORT_MAP = {
    score: ['SCORE_DESC'],
    popularity: ['POPULARITY_DESC'],
    newest: ['START_DATE_DESC'],
    relevance: ['SEARCH_MATCH'],
  };
  const orderKey = (options.order_by || 'relevance').toLowerCase();
  variables.sort = SORT_MAP[orderKey] || ['SEARCH_MATCH'];

  const cacheKey = `search:${JSON.stringify(variables)}`;
  const json = await gqlFetch(gql, variables, cacheKey);
  return { data: normalizePage(json.data?.Page?.media) };
}

export async function getAnimeByGenre(genreName, page = 1, limit = 25) {
  const query = `
    query ($page: Int, $perPage: Int, $genre: String) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, genre: $genre, sort: POPULARITY_DESC, isAdult: false) {
          ${ANIME_FIELDS}
        }
      }
    }
  `;
  const cacheKey = `genre:${genreName}:${page}:${limit}`;
  const json = await gqlFetch(query, { page, perPage: limit, genre: genreName }, cacheKey);
  return { data: normalizePage(json.data?.Page?.media) };
}

export async function getSeasonalAnime(year, season, page = 1, limit = 25) {
  // AniList season values: WINTER SPRING SUMMER FALL
  const seasonUpper = season.toUpperCase();
  const query = `
    query ($page: Int, $perPage: Int, $season: MediaSeason, $seasonYear: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, season: $season, seasonYear: $seasonYear, sort: POPULARITY_DESC, isAdult: false) {
          ${ANIME_FIELDS}
        }
      }
    }
  `;
  const cacheKey = `seasonal:${year}:${seasonUpper}:${page}:${limit}`;
  const json = await gqlFetch(query, { page, perPage: limit, season: seasonUpper, seasonYear: year }, cacheKey);
  return { data: normalizePage(json.data?.Page?.media) };
}

export async function getCurrentSeasonalAnime(page = 1, limit = 25) {
  // Derive current season from today's date
  const now = new Date();
  const month = now.getMonth(); // 0-indexed
  const year = now.getFullYear();
  let season;
  if (month >= 0 && month <= 2) season = 'WINTER';
  else if (month >= 3 && month <= 5) season = 'SPRING';
  else if (month >= 6 && month <= 8) season = 'SUMMER';
  else season = 'FALL';

  const query = `
    query ($page: Int, $perPage: Int, $season: MediaSeason, $seasonYear: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, season: $season, seasonYear: $seasonYear, sort: POPULARITY_DESC, isAdult: false) {
          ${ANIME_FIELDS}
        }
      }
    }
  `;
  const cacheKey = `seasonal:current:${year}:${season}:${page}:${limit}`;
  const json = await gqlFetch(query, { page, perPage: limit, season, seasonYear: year }, cacheKey);
  return { data: normalizePage(json.data?.Page?.media) };
}

// ---------------------------------------------------------------------------
// Genre map — AniList uses genre names directly (not numeric IDs).
// Kept the same keys so Search.jsx filter logic continues to work.
// ---------------------------------------------------------------------------
export const GENRE_MAP = {
  'Action': 'Action',
  'Adventure': 'Adventure',
  'Comedy': 'Comedy',
  'Drama': 'Drama',
  'Fantasy': 'Fantasy',
  'Horror': 'Horror',
  'Mystery': 'Mystery',
  'Romance': 'Romance',
  'Sci-Fi': 'Sci-Fi',
  'Slice of Life': 'Slice of Life',
  'Sports': 'Sports',
  'Supernatural': 'Supernatural',
  'Thriller': 'Thriller',
};

export const GENRE_COLORS = {
  'Action': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Adventure': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'Comedy': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Drama': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Fantasy': 'bg-[#00f3ff]/20 text-[#00f3ff] border-[#00f3ff]/30',
  'Horror': 'bg-red-500/20 text-red-400 border-red-500/30',
  'Mystery': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  'Romance': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'Sci-Fi': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'Slice of Life': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  'Sports': 'bg-lime-500/20 text-lime-400 border-lime-500/30',
  'Supernatural': 'bg-[#00f3ff]/20 text-[#00f3ff] border-[#00f3ff]/30',
  'Thriller': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
};

export function getGenreColor(genreName) {
  return GENRE_COLORS[genreName] || 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
}
