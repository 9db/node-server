import HttpMethod from 'http/enum/method';
import PlaintextEndpoint from 'endpoint/plaintext';

const manifest = require('../../../../package.json');

class VersionPlaintextEndpoint extends PlaintextEndpoint {
	protected static url = '/version';
	protected static method = HttpMethod.GET;

	protected process(): Promise<string> {
		return Promise.resolve(manifest.version);
	}
}

export default VersionPlaintextEndpoint;
