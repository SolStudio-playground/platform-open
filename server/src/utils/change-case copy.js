const paramCase = (string) => {
  return string
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

const snakeCase = (string) => {
  return string
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

// const titleCase = (str) => {
//   return str
//     .toLowerCase()
//     .split('-')
//     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(' ');
// };
const titleCase = (str) => {
  // Replace hyphens with spaces; assume original title had no hyphens
  return decodeURIComponent(str.replace(/-/g, ' '));
};
module.exports = {
  snakeCase,
  paramCase,
  titleCase,
  
}
