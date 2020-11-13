/**
 * Returns an absolute path based off a path relative to the root of the ceiled-server folder.
 * @param path the path relative to the root of the ceiled-server folder.
 */
const fromRoot = (path?: string): string => {
  if (!path) return '';
  return __dirname + '/../' + path;
};

export class Config {
  port = 6565;
  insecure = false;
  keyFile = fromRoot('localhost.key.pem');
  certFile = fromRoot('localhost.cert.pem');
  socketFile = fromRoot('../ceiled-driver/ceiled.sock');

  db = {
    host: 'localhost:27017',
    auth: 'admin',
    username: '',
    password: '',
    name: 'ceiled',
    collection: 'authorisedTokens',
  };

  constructor() {
    this.port = parseInt(process.env.PORT || '', 10) || this.port;
    this.insecure = process.env.INSECURE ? true : false;
    this.keyFile = fromRoot(process.env.KEY_FILE) || this.keyFile;
    this.certFile = fromRoot(process.env.CERT_FILE) || this.certFile;
    this.socketFile = fromRoot(process.env.CEILED_SOCKET) || this.socketFile;

    this.db.host = process.env.DB_HOST || this.db.host;
    this.db.auth = process.env.DB_AUTH || this.db.auth;
    this.db.username = process.env.DB_USERNAME || this.db.username;
    this.db.password = process.env.DB_PASSWORD || this.db.password;
    this.db.name = process.env.DB_NAME || this.db.name;
  }
}
