import HttpMethod from 'http/enum/method';
import PlaintextRoute from 'route/plaintext';
import PlaintextVersionEndpoint from 'endpoint/plaintext/version';

class PlaintextVersionRoute extends PlaintextRoute {
	public constructor() {
		super(HttpMethod.GET, '/version', PlaintextVersionEndpoint);
	}
}

export default PlaintextVersionRoute;
