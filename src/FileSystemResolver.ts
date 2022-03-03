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
		let fsPath: string | undefined;
		let handle = null;

		if (this.cache &&
			(fsPath = this.cache.get(path)) &&
			!(handle = await tryResolve(fsPath))
		) {
			this.cache.delete(path);
			this.logger.debug(`Cache invalid; File no longer exists: ${fsPath}`);
		}

		let i = 0;
		while (!handle && i < this.roots.length) {
			fsPath = join(this.roots[i++], path);
			handle ??= await tryResolve(fsPath);
		}

		if (!handle) {
			this.logger.debug(`Could not resolve ${path}`);
			return null;
		}

		this.cache?.set(path, fsPath!);
		this.logger.debug(`Path ${path} resolved to ${fsPath}`);
		return handle.createReadStream();
	}
}
