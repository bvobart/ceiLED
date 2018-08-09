export const toRgbString = (color) => {
  return 'rgb(' + color.red + ',' + color.green + ',' + color.blue + ')';
};

export const toRgbStringsList = (colors) => {
  const res = colors.reduce((result, color, index) => {
    return result + toRgbString(color) + ' ' + (index / colors.length) * 100 + '%' + (index + 1 !== colors.length ? ', ' : '');
  }, '');
  console.log(res);
  return res;
};