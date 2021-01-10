import HTTP from 'http';

import HttpMethod from 'http/enum/method';
import PlaintextRoute from 'route/plaintext';
import PlaintextRobotsEndpoint from 'endpoint/plaintext/robots';

class PlaintextRobotsRoute extends PlaintextRoute {
	public constructor() {
		super(HttpMethod.GET, '/robots.txt', PlaintextRobotsEndpoint);
	}

	protected matchesContentType(_request: HTTP.IncomingMessage): boolean {
		return true;
	}
}

export default PlaintextRobotsRoute;
