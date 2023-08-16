export interface Logger {
	debug(message: string): void;
	info(message: string): void;
	warn(message: string): void;
	error(message: string): void;
}

function createLogCallback(verb: 'debug' | 'info' | 'warn' | 'error') {
	const level = verb.toUpperCase();
	return (message: string) => {
		// eslint-disable-next-line no-console
		console[verb](`[${level}][DevServer]: ${message}`);
	};
}

/**
 * The default logger set to output severities INFO and up.
 */
export const defaultLogger: Logger = {
	debug() {
		// no-op
	},
	info: createLogCallback('info'),
	warn: createLogCallback('warn'),
	error: createLogCallback('error')
};
