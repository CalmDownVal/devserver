import { createServer, RequestListener, Server, ServerResponse, STATUS_CODES } from 'http';
import type { AddressInfo } from 'net';
import { extname } from 'path';

import type { DevServerOptions } from './DevServerOptions';
import { defaultLogger, Logger } from './Logger';
import type { Resolver } from './Resolver';
import { header, mimeType, statusCode } from './utils/constants';
import { getListenerScriptTag, handleCors, removeQueryString } from './utils/misc';

const EVENT_SOURCE_PATH = '/?events';
const DEFAULT_MIME_TYPES = {
	css: mimeType.stylesheet,
	html: mimeType.hypertext,
	htm: mimeType.hypertext,
	js: mimeType.javaScript,
	mjs: mimeType.javaScript
};

export class DevServer {
	/**
	 * Gets the hostname (IPv4 or IPv6 address) this DevServer is listening on.
	 */
	public readonly hostname: string;

	/**
	 * Gets the port this DevServer is listening on.
	 */
	public readonly port: number;

	/**
	 * Gets the full URL of this DevServer.
	 */
	public readonly url: string;

	private readonly allowCors: boolean;
	private readonly indexFileName: string;
	private readonly injectPattern: RegExp;
	private readonly eventSourcePath: string;
	private readonly listeners = new Set<ServerResponse>();
	private readonly logger: Logger;
	private readonly mimeTypes: Record<string, string | undefined>;
	private readonly resolver: Resolver;

	private constructor(
		private readonly server: Server,
		options: DevServerOptions
	) {
		const info = server.address() as AddressInfo;

		this.hostname = info.address;
		this.port = info.port;
		this.url = `http://${info.family === 'IPv6' ? `[${info.address}]` : info.address}:${info.port}`;

		this.allowCors = options.allowCors ?? false;
		this.indexFileName = options.indexFileName ?? 'index.html';
		this.injectPattern = options.injectPattern ?? /.html?$/i;
		this.eventSourcePath = options.eventSourcePath ?? '/?events';
		this.logger = options.logger ?? defaultLogger;
		this.resolver = options.resolver;
		this.mimeTypes = {
			...DEFAULT_MIME_TYPES,
			...options.mimeTypes
		};

		server.on('request', this.onRequest);
		server.on('error', this.onError);
		this.logger.info(`DevServer now listening at ${this.url}`);
	}

	/**
	 * Stops the server and closes all connections.
	 */
	public stop() {
		return new Promise<void>((resolve, reject) => {
			this.logger.info('closing server...');
			this.server.close(error => {
				if (error) {
					reject(error);
				}
				else {
					resolve();
				}
			});

			this.listeners.forEach(listener => listener.end());
			this.listeners.clear();
		});
	}

	/**
	 * Sends a reload notification to all listeners.
	 */
	public notifyReload() {
		if (this.listeners.size === 0) {
			this.logger.debug('Notification was issued, but there were no listeners.');
			return;
		}

		this.logger.info('Notifying reload listeners...');
		this.listeners.forEach(listener => {
			listener.write('data: reload\n\n');
		});
	}

	private readonly onRequest: RequestListener = async (request, response) => {
		try {
			if (this.allowCors && handleCors(request, response)) {
				return;
			}

			if (request.method !== 'GET') {
				response.statusCode = statusCode.methodNotAllowed;
				response.end();
				return;
			}

			if (request.url === this.eventSourcePath) {
				response.setHeader(header.contentType, mimeType.eventStream);
				response.flushHeaders();

				this.listeners.add(response);
				this.logger.debug('Reload notification listener connected.');

				response.on('close', () => {
					this.listeners.delete(response);
					this.logger.debug('Reload notification listener disconnected.');
				});

				return;
			}

			let path = removeQueryString(request.url!);
			if (path.endsWith('/')) {
				path += this.indexFileName;
			}

			const source = await this.resolver.resolve(path);
			if (!source) {
				response.statusCode = statusCode.notFound;
				response.end();
				return;
			}

			const ext = extname(path)
				.slice(1)
				.toLowerCase();

			response.setHeader(header.contentType, this.mimeTypes[ext] ?? mimeType.binary);

			const pipeOptions = {
				end: true
			};

			if (this.injectPattern.test(path)) {
				pipeOptions.end = false;
				source.on('end', () => {
					const injectedHtml = getListenerScriptTag(`${this.url}${this.eventSourcePath}`);
					response.end(injectedHtml, 'utf8');
				});
			}

			source.pipe(response, pipeOptions);
		}
		catch (ex: any) {
			this.logger.error('An error occurred while handling a request:', ex);
			response.statusCode = statusCode.internalServerError;
			response.end();
		}
		finally {
			this.logger.info(`${request.method} ${request.url} -> ${response.statusCode} ${STATUS_CODES[response.statusCode]}`);
		}
	};

	private readonly onError = (ex: Error) => {
		this.logger.error('An error occurred within the HTTP server.', ex);
	};

	/**
	 * Creates a new DevServer using the provided options. Returns a promise
	 * that resolves once the server successfully binds to a port and starts
	 * listening.
	 */
	public static start(options: DevServerOptions) {
		return new Promise<DevServer>((resolve, reject) => {
			const server = createServer();
			server.once('error', reject);
			server.once('listening', () => {
				try {
					server.off('error', reject);
					resolve(new DevServer(server, options));
				}
				catch (ex) {
					reject(ex);
				}
			});

			server.listen({
				host: options.host ?? 'localhost',
				port: options.port ?? 0
			});
		});
	}
}
