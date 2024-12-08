type LogLevel = 'info' | 'warn' | 'error';

class Logger {
	private log(level: LogLevel, ...args: unknown[]): void {
		if (process.env.NODE_ENV === 'development') {
			// eslint-disable-next-line no-console
			console[level](...args);
		}
	}

	info(...args: unknown[]): void {
		this.log('info', ...args);
	}

	warn(...args: unknown[]): void {
		this.log('warn', ...args);
	}

	error(...args: unknown[]): void {
		this.log('error', ...args);
	}
}

export const logger = new Logger();
