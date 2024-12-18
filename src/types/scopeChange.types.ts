export type ScopeChangeRequest = {
	id?: string; // Optional for new requests
	project_id: string;
	requester_id: string;
	title: string;
	description: string;
	created_at?: string; // Optional for requests fetched from the database
};
