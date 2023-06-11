import { fetchRefresh } from '$helpers';
import { error } from '@sveltejs/kit';
import type { PageLoad } from '../$types';

export const load: PageLoad = async ({ fetch, url }) => {
	const limit = 18;
	const page = url.searchParams.get('page');

	const searchParams = new URLSearchParams({
		limit: `${limit}`,
		offset: page ? `${limit * (+page - 1)}` : '0'
	}).toString();

	const playlistRes = await fetchRefresh(fetch, `/api/spotify/me/playlists?${searchParams}`);

	if (!playlistRes.ok) {
		throw error(playlistRes.status, 'Failed to load playlists');
	}

	const playlistJSON: SpotifyApi.ListOfCurrentUsersPlaylistsResponse = await playlistRes.json();

	return {
		userPlaylists: playlistJSON,
		title: 'Your Playlists'
	};
};
