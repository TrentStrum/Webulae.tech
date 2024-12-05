export async function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 5000): Promise<T> {
	const timeout = new Promise<never>((_, reject) => {
		setTimeout(() => {
			reject(new Error(`Request timed out after ${timeoutMs}ms`));
		}, timeoutMs);
	});

	return Promise.race([promise, timeout]);
}
