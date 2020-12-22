import HTTP from 'http';

import Endpoint from 'endpoint';
import Repository from 'repository';
import JsonObject from 'http/type/json-object';
import UrlParameters from 'http/type/url-parameters';

interface EndpointConstructor {
	new (
		request: HTTP.IncomingMessage,
		response: HTTP.ServerResponse,
		url_parameters: UrlParameters,
		repository: Repository
		// eslint-disable-next-line @typescript-eslint/ban-types
	): Endpoint<object, string | JsonObject | Buffer>;
}

export default EndpointConstructor;
