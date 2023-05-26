import { config } from 'dotenv-flow';
config();

const apiKey1 = process.env.API_KEY1;
const apiKey2 = process.env.API_KEY2;

export default {
  apiKey1,
  apiKey2,
}

export const API_URL = 'https://forkify-api.herokuapp.com/api/v2/recipes/';

export const TIMEOUT_SEC = 10;

export const RESULT_PER_PAGE = 10;

export const MODAL_CLOSE_SEC = 2.5;

export default config;
