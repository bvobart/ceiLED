export const toRgbString = (color) => {
  return 'rgb(' + color.red + ',' + color.green + ',' + color.blue + ')';
};

export const toRgbStringsList = (colors) => {
  if (colors.length === 1) {
    return toRgbString(colors[0]) + ' 0%, ' + toRgbString(colors[0]) + ' 100%';
  }
  const res = colors.reduce((result, color, index) => {
    const percent = (index / (colors.length - 1)) * 100;
    return result + toRgbString(color) + ' ' + percent + '%' + (index + 1 !== colors.length ? ', ' : '');
  }, '');
  return res;
};
