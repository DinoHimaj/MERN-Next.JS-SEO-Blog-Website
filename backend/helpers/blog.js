exports.smartTrim = (str, length, delim, appendix) => {
  if (str.length <= length) return str;
  let trimmedStr = str.substr(0, length + delim.length);
  let lastDelimIndex = trimmedStr.lastIndexOf(delim);
  if (lastDelimIndex >= 0) trimmedStr = trimmedStr.substr(0, lastDelimIndex);
  trimmedStr += appendix;
  return trimmedStr;
};
