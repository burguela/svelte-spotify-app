import { SPOTIFY_BASE_URL } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, fetch, url }) => {
	const accessToken = cookies.get('access_token');
	const refreshToken = cookies.get('refresh_token');
	if (!accessToken) {
		return {
			user: null
		};
	}

	const profileRes = await fetch(`${SPOTIFY_BASE_URL}/me`, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	if (profileRes.ok) {
		const profile = await profileRes.json();
		let userAllPlaylists: SpotifyApi.PlaylistObjectSimplified[] = [];
		const userPlaylistsRes = await fetch('/api/spotify/me/playlists?limit=50');
		if (userPlaylistsRes.ok) {
			const userAllPlaylistsResJSON: SpotifyApi.ListOfCurrentUsersPlaylistsResponse =
				await userPlaylistsRes.json();
			userAllPlaylists = userAllPlaylistsResJSON.items;
		}
		return {
			user: profile as SpotifyApi.CurrentUsersProfileResponse,
			userAllPlaylists
		};
	}
	if (profileRes.status === 401 && refreshToken) {
		// refresh the token an try again
		const refreshRes = await fetch('/api/auth/refresh');
		if (refreshRes.ok) {
			throw redirect(307, url.pathname);
		}
		return {
			user: null
		};
	} else {
		return {
			user: null
		};
	}
};
