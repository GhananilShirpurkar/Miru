/**
 * @typedef {Object} Genre
 * @property {number} mal_id
 * @property {string} name
 * @property {string} type
 */

/**
 * @typedef {Object} Studio
 * @property {number} mal_id
 * @property {string} name
 * @property {string} type
 */

/**
 * @typedef {Object} Anime
 * @property {number} mal_id
 * @property {string} title
 * @property {string|null} title_english
 * @property {string|null} title_japanese
 * @property {Object} images
 * @property {Object} images.jpg
 * @property {string} images.jpg.image_url
 * @property {string} images.jpg.large_image_url
 * @property {string} images.jpg.small_image_url
 * @property {Object} images.webp
 * @property {string} images.webp.image_url
 * @property {string} images.webp.large_image_url
 * @property {string} images.webp.small_image_url
 * @property {string|null} synopsis
 * @property {number|null} score
 * @property {number|null} scored_by
 * @property {number|null} rank
 * @property {number|null} popularity
 * @property {number|null} episodes
 * @property {string} status
 * @property {boolean} airing
 * @property {Object} aired
 * @property {string|null} aired.from
 * @property {string|null} aired.to
 * @property {string} aired.string
 * @property {string} duration
 * @property {string} rating
 * @property {Genre[]} genres
 * @property {Studio[]} studios
 * @property {Object|null} trailer
 * @property {string|null} trailer.youtube_id
 * @property {string|null} trailer.url
 * @property {string|null} trailer.embed_url
 * @property {string} source
 * @property {string} type
 * @property {number} members
 * @property {number} favorites
 */

/**
 * @template T
 * @typedef {Object} JikanResponse
 * @property {T} data
 * @property {Object} [pagination]
 * @property {number} pagination.last_visible_page
 * @property {boolean} pagination.has_next_page
 * @property {number} pagination.current_page
 * @property {Object} pagination.items
 * @property {number} pagination.items.count
 * @property {number} pagination.items.total
 * @property {number} pagination.items.per_page
 */

/**
 * @template T
 * @typedef {Object} JikanListResponse
 * @property {T[]} data
 * @property {Object} [pagination]
 * @property {number} pagination.last_visible_page
 * @property {boolean} pagination.has_next_page
 * @property {number} pagination.current_page
 * @property {Object} pagination.items
 * @property {number} pagination.items.count
 * @property {number} pagination.items.total
 * @property {number} pagination.items.per_page
 */

/**
 * @typedef {'score'|'popularity'|'members'|'favorites'} SortOption
 */

export {};
