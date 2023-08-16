/* eslint-disable no-console */

export interface Logger {
	debug(message: string, ...extra: unknown[]): void;
	info(message: string, ...extra: unknown[]): void;
	error(message: string, ...extra: unknown[]): void;
}

const noop = () => {};

/**
 * The default logger; Only outputs errors to the console and drops everything
 * else.
 */
export const defaultLogger: Logger = {
	debug: noop,
	info: noop,
	error(message, ...extra) {
		console.error('[Error][DevServer]:', message, ...extra);
	}
};
