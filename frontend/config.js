// Public config for frontend (client-safe)
const isProd =
  process.env.NEXT_PUBLIC_PRODUCTION === 'true' ||
  process.env.NODE_ENV === 'production';

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'SEOBLOG';

export const API = isProd
  ? process.env.NEXT_PUBLIC_API_PRODUCTION
  : process.env.NEXT_PUBLIC_API_DEVELOPMENT || 'http://localhost:8000/api';

export const DOMAIN = isProd
  ? process.env.NEXT_PUBLIC_DOMAIN_PRODUCTION
  : process.env.NEXT_PUBLIC_DOMAIN_DEVELOPMENT || 'http://localhost:3000';
