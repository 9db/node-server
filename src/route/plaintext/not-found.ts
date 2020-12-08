import HTTP from 'http';

import Adapter from 'interface/adapter';
import HttpMethod from 'http/enum/method';
import PlaintextRoute from 'route/plaintext';
import PlaintextNotFoundEndpoint from 'endpoint/plaintext/not-found';

class PlaintextNotFoundRoute extends PlaintextRoute {
	public constructor(adapter: Adapter) {
		super(HttpMethod.GET, '/404', PlaintextNotFoundEndpoint, adapter);
	}

	public accepts(request: HTTP.IncomingMessage): boolean {
		return this.matchesContentType(request);
	}
}

export default PlaintextNotFoundRoute;
