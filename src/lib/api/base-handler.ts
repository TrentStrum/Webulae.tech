import { auth } from '@clerk/nextjs/server';

import { handleAPIError , APIError } from './error-handler';

export abstract class BaseAPIHandler {
	protected async handleRequest(req: Request, handler: () => Promise<Response>): Promise<Response> {
		try {
			const response = await handler();
			return response;
		} catch (error) {
			return handleAPIError(error);
		}
	}

	protected validateAuth(): void {
		const { userId, orgId } = auth();
		if (!userId || !orgId) {
			throw new APIError('Unauthorized', 401);
		}
	}
}
