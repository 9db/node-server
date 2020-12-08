import HTTP from 'http';

import JsonRoute from 'route/json';
import HttpMethod from 'http/enum/method';
import JsonNotFoundEndpoint from 'endpoint/json/not-found';

class JsonNotFoundRoute extends JsonRoute {
	public constructor() {
		super(HttpMethod.GET, '/404', JsonNotFoundEndpoint);
	}

	public accepts(request: HTTP.IncomingMessage): boolean {
		return this.matchesContentType(request);
	}
}

export default JsonNotFoundRoute;
