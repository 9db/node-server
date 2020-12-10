import PlaintextEndpoint from 'endpoint/plaintext';

class PlaintextVersionEndpoint extends PlaintextEndpoint {
	protected process(): Promise<string> {
		return Promise.resolve('0.0.1');
	}
}

export default PlaintextVersionEndpoint;
