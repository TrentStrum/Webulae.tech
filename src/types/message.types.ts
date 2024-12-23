export type Message = {
	id: string; // Unique identifier for the message
	subject: string; // Subject or title of the message
	content: string; // Main content of the message
	status: 'unread' | 'read'; // Status of the message (e.g., unread or read)
	created_at: string; // Timestamp of when the message was created
	sender: {
		id: string;
		full_name: string;
		username: string;
	}; // ID of the user who sent the message
	recipient_id: string; // ID of the user who received the message
	project_id: string; // ID of the project the message belongs to
	profiles: {
		full_name: string | null; // Full name of the sender
		username: string | null; // Username of the sender
	}; // Profile details of the sender
};
