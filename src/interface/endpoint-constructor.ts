import HTTP from 'http';

import Endpoint from 'endpoint';

interface EndpointConstructor {
	new (request: HTTP.IncomingMessage, response: HTTP.ServerResponse): Endpoint;
	accepts(request: HTTP.IncomingMessage): boolean;
}

export default EndpointConstructor;
