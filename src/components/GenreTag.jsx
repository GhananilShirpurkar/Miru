import React from 'react';

export function GenreTag({ genre }) {
  if (!genre || !genre.name) return null;
  
  const name = genre.name;
  
  // Apply visual accent variations depending on the genre
  let variantClass = '';
  if (name.toLowerCase() === 'action') {
    variantClass = 'genre-action';
  }

  return (
    <span className={`genre-tag ${variantClass}`}>
      {name}
    </span>
  );
}

export default GenreTag;
