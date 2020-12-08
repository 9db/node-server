import HTTP from 'http';

import Endpoint from 'endpoint';
import RouteInterface from 'interface/route';

interface EndpointConstructor {
	new (
		request: HTTP.IncomingMessage,
		response: HTTP.ServerResponse,
		route: RouteInterface
	): Endpoint;
}

export default EndpointConstructor;
