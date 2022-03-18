import type { IncomingMessage, ServerResponse } from 'http';

import { header } from './constants';

export function getListenerScriptTag(endpointUrl: string) {
	return `\
<script type="text/javascript">
(src => {
	let isConnected = false;
	src.addEventListener('open', () => { !isConnected && console.info('DevServer: connected'), isConnected = true; });
	src.addEventListener('error', () => { isConnected && console.warn('DevServer: disconnected'), isConnected = false; });
	src.addEventListener('message', () => window.location.reload());
})(new EventSource('${endpointUrl}'));
</script>
`;
}

export function handleCors(request: IncomingMessage, response: ServerResponse) {
	response.setHeader(header.accessControlAllowOrigin, request.headers.origin ?? '*');
	if (request.method !== 'OPTIONS') {
		return false;
	}

	// handle preflight requests
	response.setHeader(header.accessControlAllowMethods, 'GET');
	response.setHeader(header.accessControlMaxAge, '86400');
	response.end();
	return true;
}

export function removeQueryString(path: string) {
	const index = path.indexOf('?');
	return index === -1 ? path : path.slice(0, index);
}
