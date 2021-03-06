import type { Logger } from './Logger';
import type { Resolver } from './Resolver';

export interface DevServerOptions {
	/**
	 * Controls whether cross-origin requests should be allowed or not.
	 *
	 * Defaults to `false`
	 */
	allowCors?: boolean;

	/**
	 * The host to bind to.
	 *
	 * Defaults to `'localhost'`
	 */
	host?: string;

	/**
	 * The implicit index file name when accessing a directory path.
	 *
	 * Defaults to `'index.html'`
	 */
	indexFileName?: string;

	/**
	 * Regular expression to match files to which a <script> tag with livereload
	 * logic will be injected.
	 *
	 * Defaults to `/\.html?$/i`
	 */
	injectPattern?: RegExp;

	/**
	 * The path at which event stream for the livereload mechanism is hosted.
	 *
	 * Defaults to `'/?events'`
	 */
	eventSourcePath?: string;

	/**
	 * An optional logger facade to forward logging to.
	 */
	logger?: Logger;

	/**
	 * A mapping of *lowercase* file extensions to their MIME-Type string. Files
	 * with unknown extensions will be served as `application/octet-stream` by
	 * default.
	 *
	 * By default the following file extensions are recognized:
	 * html, htm, js, mjs, cjs, css, jpg, jpeg, png, svg, webp
	 */
	mimeTypes?: Record<string, string | undefined>;

	/**
	 * The port to bind to.
	 *
	 * Defaults to zero, which makes Node choose any free port ≥8000.
	 */
	port?: number;

	/**
	 * The Resolver to use for the created instance of DevServer.
	 */
	resolver: Resolver;
}
