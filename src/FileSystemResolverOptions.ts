import type { Logger } from './Logger';

export interface FileSystemResolverOptions {
	/**
	 * Controls whether to cache the results of past resolutions to avoid
	 * unnecessary FS operations during future resolutions. Only has effect when
	 * at least two content roots are defined.
	 */
	allowCache?: boolean;

	/**
	 * Paths to directories to use as content roots. Relative paths are resolved
	 * against current working directory.
	 *
	 * Order of this array is respected when resolving a path.
	 */
	contentRoots: string[];

	/**
	 * An optional logger facade to forward logging to.
	 */
	logger?: Logger;
}
