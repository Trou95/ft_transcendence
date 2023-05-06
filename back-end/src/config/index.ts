import * as process from "process";

const config = {
  intra: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    tokenUrl: process.env.TOKEN_URL,
    redirectUrl: process.env.REDIRECT_URL,
    apiUrl: process.env.API_URL,
  },
};

export default config;
