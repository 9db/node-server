import HTTP from 'http';

import Adapter from 'interface/adapter';
import JsonRoute from 'route/json';
import HttpMethod from 'http/enum/method';
import JsonNotFoundEndpoint from 'endpoint/json/not-found';

class JsonNotFoundRoute extends JsonRoute {
	public constructor(adapter: Adapter) {
		super(HttpMethod.GET, '/404', JsonNotFoundEndpoint, adapter);
	}

	public accepts(request: HTTP.IncomingMessage): boolean {
		return this.matchesContentType(request);
	}
}

export default JsonNotFoundRoute;
