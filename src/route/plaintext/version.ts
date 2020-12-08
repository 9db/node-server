import Adapter from 'interface/adapter';
import HttpMethod from 'http/enum/method';
import PlaintextRoute from 'route/plaintext';
import PlaintextVersionEndpoint from 'endpoint/plaintext/version';

class PlaintextVersionRoute extends PlaintextRoute {
	public constructor(adapter: Adapter) {
		super(HttpMethod.GET, '/version', PlaintextVersionEndpoint, adapter);
	}
}

export default PlaintextVersionRoute;
