export interface Env {
  OPENAI_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  SUPABASE_JWT_SECRET: string;
  SUPABASE_ANON_KEY: string;
}


// CORS headers
export const CORS_HEADERS = {
    //   "Access-Control-Allow-Origin": [
    //     "http://localhost:*",
    //     "https://demo.zybertrain.com:*",
    //   ].join(", "), // Allow http localhost on any port, and https demo.zybertrain.com
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS", // Allow methods
    "Access-Control-Allow-Headers": "Content-Type, Authorization", // Allow specific headers
  };
  