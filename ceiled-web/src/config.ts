const devServerAddress = 'http://localhost:6565';
const stagingServerAddress = 'https://bart.vanoort.is:6666';
const productionServerAddress = 'https://bart.vanoort.is:6565';

const serverAddress = 
  process.env.REACT_APP_ENV === 'production'
  ? productionServerAddress
  : process.env.REACT_APP_ENV === 'staging'
  ? stagingServerAddress
  : devServerAddress;

const config = {
  serverAddress
};

export default config;
