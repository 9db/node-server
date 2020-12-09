import HTTP from 'http';

import Adapter from 'interface/adapter';
import Endpoint from 'endpoint';
import JsonObject from 'http/type/json-object';
import RouteInterface from 'interface/route';

interface EndpointConstructor {
	new (
		request: HTTP.IncomingMessage,
		response: HTTP.ServerResponse,
		route: RouteInterface,
		adapter: Adapter
	): Endpoint<string | JsonObject>;
}

export default EndpointConstructor;
