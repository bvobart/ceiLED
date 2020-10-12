import env from "@beam-australia/react-env";

const serverAddress = env('API_ADDRESS') || 'api.' + window.location.host;

const config = { serverAddress };
export default config;
