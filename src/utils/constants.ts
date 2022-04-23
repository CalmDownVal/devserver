export const header = {
	accessControlAllowOrigin: 'Access-Control-Allow-Origin',
	accessControlAllowMethods: 'Access-Control-Allow-Methods',
	accessControlMaxAge: 'Access-Control-Max-Age',
	contentType: 'Content-Type'
};

export const statusCode = {
	notFound: 404,
	methodNotAllowed: 405,
	internalServerError: 500
};

export const mimeType = {
	binary: 'application/octet-stream',
	eventStream: 'text/event-stream',
	hypertext: 'text/html',
	javascript: 'text/javascript',
	stylesheet: 'text/css',
	imageJpeg: 'image/jpeg',
	imagePng: 'image/png',
	imageSvg: 'image/svg+xml',
	imageWebp: 'image/webp'
};

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
	svg: mimeType.imageSvg,
	webp: mimeType.imageWebp
};
