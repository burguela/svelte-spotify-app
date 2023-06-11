# Spotify Clone

Spotify Clone using the [`SvelteKit Framework`](https://kit.svelte.dev/) and the [`Spotify Web API`](https://developer.spotify.com/documentation/web-api).

## Running on you local machine

Clone the repository into you computer, and run:
```bash
# Install all dependencies
npm install
```

Then go to [`Spotify Developer Website`](https://developer.spotify.com/documentation/web-api/concepts/apps) and create a new App with Redirect URIs to http://localhost:5173/. Save the CLIENT_ID and CLIENT_SECRET.

Create a .env file in the cloned repository with:
SPOTIFY_APP_CLIENT_ID=(your client id here)
SPOTIFY_APP_CLIENT_SECRET=(your client secret here)
SPOTIFY_BASE_URL=https://api.spotify.com/v1
BASE_URL=http://localhost:5173

To start the development server, run:
```bash
# Install all dependencies
npm run dev
```

At this point the app is running in your machine. Open a new tab with the URL http://localhost:5173/ and start using the Spotify Clone.

App based on the [`Svelte & SvelteKit: The Complete Guide`](https://www.udemy.com/course/svelte-and-sveltekit/) from [`Ali Alaa`](https://www.udemy.com/user/ali-alaa-3/)