// Remove getConfig import and replace with direct environment variables

// For client-side (public) variables
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'SEOBLOG';
export const API =
  process.env.NEXT_PUBLIC_PRODUCTION === 'true'
    ? 'http://seoblog.com'
    : process.env.NEXT_PUBLIC_API_DEVELOPMENT || 'http://localhost:8000/api';

// For server-side only variables (only use these in getServerSideProps or API routes)
// Not directly importable in client components
