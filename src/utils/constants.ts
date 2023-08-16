export const header = {
	accessControlAllowOrigin: 'Access-Control-Allow-Origin',
	accessControlAllowMethods: 'Access-Control-Allow-Methods',
	accessControlMaxAge: 'Access-Control-Max-Age',
	contentType: 'Content-Type'
} as const;

export const statusCode = {
	ok: 200,
	notFound: 404,
	methodNotAllowed: 405,
	internalServerError: 500
} as const;

export const mimeType = {
	binary: 'application/octet-stream',
	eventStream: 'text/event-stream',
	hypertext: 'text/html',
	javascript: 'text/javascript',
	stylesheet: 'text/css',
	imageJpeg: 'image/jpeg',
	imagePng: 'image/png',
	imageGif: 'image/gif',
	imageSvg: 'image/svg+xml',
	imageWebp: 'image/webp'
} as const;

export const defaultMimeTypeMapping = {
	html: mimeType.hypertext,
	htm: mimeType.hypertext,
	js: mimeType.javascript,
	mjs: mimeType.javascript,
	cjs: mimeType.javascript,
	css: mimeType.stylesheet,
	jpg: mimeType.imageJpeg,
	jpeg: mimeType.imageJpeg,
	png: mimeType.imagePng,
	gif: mimeType.imageGif,
	svg: mimeType.imageSvg,
	webp: mimeType.imageWebp
} as const;
