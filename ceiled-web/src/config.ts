const serverAddress = process.env.REACT_APP_API_ADDRESS || 'api.' + window.location.host;

const config = { serverAddress };
export default config;
