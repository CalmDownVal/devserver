import type { Readable } from 'stream';

export interface Resolver {
	/**
	 * Resolves a path from a HTTP GET request to a Readable stream with
	 * response data or null indicating a 'Not Found' response.
	 */
	resolve(path: string): Promise<Readable | null>;
}
