import { fetchRefresh } from '$helpers';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch: _fetch, parent }) => {
	const fetch = (path: string) => fetchRefresh(_fetch, path);
	const { user } = await parent();
	const newReleases = fetch('/api/spotify/browse/new-releases?limit=6');
	const featuredPlaylists = fetch('/api/spotify/browse/featured-playlists?limit=6');
	const userPlaylists = fetch(`/api/spotify/users/${user?.id}/playlists?limit=6`);

	const catsRes = await fetch(`api/spotify/browse/categories`);
	const catsResJSON: SpotifyApi.MultipleCategoriesResponse | undefined = catsRes.ok
		? await catsRes.json()
		: undefined;

	const randomCats = catsResJSON
		? catsResJSON.categories.items.sort(() => 0.5 - Math.random()).slice(0, 3)
		: [];

	const randomCatsPromises = randomCats.map((cat) =>
		fetch(`/api/spotify/browse/categories/${cat.id}/playlists?limit=6`)
	);

	const [
		newReleasesResponse,
		featuredPlaylistsResponse,
		userPlaylistsResponse,
		...randomCatsResponse
	] = await Promise.all([newReleases, featuredPlaylists, userPlaylists, ...randomCatsPromises]);

	return {
		newReleases: newReleasesResponse.ok
			? (newReleasesResponse.json() as Promise<SpotifyApi.ListOfNewReleasesResponse>)
			: undefined,
		featuredPlaylists: featuredPlaylistsResponse.ok
			? (featuredPlaylistsResponse.json() as Promise<SpotifyApi.ListOfFeaturedPlaylistsResponse>)
			: undefined,
		userPlaylists: userPlaylistsResponse.ok
			? (userPlaylistsResponse.json() as Promise<SpotifyApi.ListOfUsersPlaylistsResponse>)
			: undefined,
		homeCategories: randomCats,
		categoriesPlaylists: Promise.all(
			randomCatsResponse.map((res) =>
				res.ok ? (res.json() as Promise<SpotifyApi.CategoryPlaylistsResponse>) : undefined
			)
		)
	};
};
