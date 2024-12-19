# Cloudflare Worker

This is a Cloudflare Worker to serve as a backend server and AI gateway for Zybertrain.

## Get started

1. Have an OpenAI API key
2. Create a Cloudflare Worker
3. Clone this project and install dependencies with `npm install`
4. Run `wrangler login` to login to your Cloudflare account in wrangler
5. Make a copy of `wrangler.toml.sample` and rename it to `wrangler.toml`
6. Update the OpenAI API variables and Supabase variables in `wrangler.toml`, specifically:
    - `OPENAI_API_KEY`
    - `SUPABASE_URL`
    - `SUPABASE_SERVICE_KEY`
    - `SUPABASE_JWT_SECRET`
    - `SUPABASE_ANON_KEY`
7. Run `wrangler deploy` to publish the API to Cloudflare Workers

