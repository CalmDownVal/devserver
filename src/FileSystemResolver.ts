import { open } from 'fs/promises';
import { join, resolve } from 'path';

import type { FileSystemResolverOptions } from './FileSystemResolverOptions';
import { defaultLogger, Logger } from './Logger';
import type { Resolver } from './Resolver';

async function tryResolve(path: string) {
	let handle = null;
	try {
		handle = await open(path, 'r');
	}
	catch (ex: any) {
		if (ex.code !== 'ENOENT') {
			throw ex;
		}
	}

	return handle;
}

export class FileSystemResolver implements Resolver {
	private readonly cache?: Map<string, string>;
	private readonly logger: Logger;
	private readonly roots: readonly string[];

	public constructor(options: FileSystemResolverOptions) {
		this.logger = options.logger ?? defaultLogger;
		this.roots = options.contentRoots.map(root => resolve(root));
		if (this.roots.length === 0) {
			throw new Error('At least one content root must be configured.');
		}

		if (options.allowCache && this.roots.length > 1) {
			this.cache = new Map<string, string>();
		}
	}

	public async resolve(path: string) {
		let handle = null;
		let fsPath;

		if (this.cache) {
			fsPath = this.cache.get(path);
			if (fsPath) {
				handle = await tryResolve(fsPath);
				if (!handle) {
					this.cache.delete(path);
					this.logger.debug(`Cache miss; File no longer exists: ${fsPath}`);
				}
			}
		}

		for (const root of this.roots) {
			fsPath = join(root, path);
			handle ??= await tryResolve(fsPath);
			if (handle) {
				this.cache?.set(path, fsPath);
				break;
			}
		}

		if (handle) {
			this.logger.debug(`Path ${path} resolved to ${fsPath}`);
			return handle.createReadStream();
		}

		this.logger.debug(`Could not resolve ${path}`);
		return null;
	}
}
