// some helper functions to help speed up development procsss

export const getKeywordFromURL = () => {
  let urlLocation = window.location.search,
    index = urlLocation.search(/=/g);
  if (!urlLocation) return "";
  return urlLocation.slice(index + 1, urlLocation.length);
};

export const getKeywordObjFromURL = () => {
  let keyword = getKeywordFromURL();
  let urlLocation = window.location.search,
    index = urlLocation.search(/=/g);
  return {
    key: urlLocation.slice(1, index),
    value: getKeywordFromURL()
  };
};

export const getRandomKey = (n = 8) => {
  let letter = "abcdefghijklmnopqrstuvxyzABCDEFGHIJKLMNOPQRSTUVXYZ";
  return Array.from({length: n})
    .fill(0)
    .map(w => letter[Math.floor(Math.random() * (letter.length - 1))])
    .join("");
};

export const getObj = (key, value) => {
  let newObj = {};
  newObj[key] = value;
  return Object.assign({}, newObj);
};

export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getObjSortKey = obj => {
  if (!obj) {
    return null;
  }
  return Object.keys(obj).sort((a, b) => a < b);
};
