import dotenv from 'dotenv';
dotenv.config();

const DB_URI = process.env.DB_URI || '';
const SERVER_PORT = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  : 3000;

export const config = {
  mongo: {
    url: DB_URI,
  },
  server: {
    port: SERVER_PORT,
  },
};
