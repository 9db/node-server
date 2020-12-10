import HTTP from 'http';

import Endpoint from 'endpoint';
import Repository from 'repository';
import JsonObject from 'http/type/json-object';
import RouteInterface from 'interface/route';

interface EndpointConstructor {
	new (
		request: HTTP.IncomingMessage,
		response: HTTP.ServerResponse,
		route: RouteInterface,
		repository: Repository
	): Endpoint<string | JsonObject>;
}

export default EndpointConstructor;
