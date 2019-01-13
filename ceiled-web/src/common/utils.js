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

/**
 * Given a host name and a boolean to indicate whether a secure connection should be made or not,
 * creates a URL that points to the CeiLED API.
 * @param {String} host Host name, including optional port
 * @param {Boolean} secure iff true use WSS, else use WS
 */
export const getApiUrl = (host, secure) => {
  const prefix = secure ? 'wss' : 'ws';
  return prefix + '://' + host + '/ceiled-api';
}
