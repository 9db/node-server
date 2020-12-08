import PlaintextEndpoint from 'endpoint/plaintext';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const manifest = require('../../../../package.json');

class PlaintextVersionEndpoint extends PlaintextEndpoint {
	protected process(): Promise<string> {
		return Promise.resolve(manifest.version);
	}
}

export default PlaintextVersionEndpoint;
