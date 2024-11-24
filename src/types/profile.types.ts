export type Profile = {
	id: string; // User ID, typically linked to the authentication provider
	full_name: string; // Full name of the user
	username: string; // Unique username for the user
	bio: string; // Short bio or description about the user
	website: string; // URL of the user's website or portfolio
	avatar_url: string | null; // URL of the user's avatar image, nullable
	created_at: string; // Timestamp of when the profile was created
	updated_at: string; // Timestamp of the last update to the profile
};
