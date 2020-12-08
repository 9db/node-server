import HTTP from 'http';

import HttpMethod from 'http/enum/method';
import PlaintextRoute from 'route/plaintext';
import PlaintextNotFoundEndpoint from 'endpoint/plaintext/not-found';

class PlaintextNotFoundRoute extends PlaintextRoute {
	public constructor() {
		super(HttpMethod.GET, '/404', PlaintextNotFoundEndpoint);
	}

	public accepts(request: HTTP.IncomingMessage): boolean {
		return this.matchesContentType(request);
	}
}

export default PlaintextNotFoundRoute;
