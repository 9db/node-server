import getManifest from 'utility/get-manifest';
import PlaintextEndpoint from 'endpoint/plaintext';

class PlaintextVersionEndpoint extends PlaintextEndpoint<
	Record<string, never>
> {
	protected process(): Promise<string> {
		const manifest = getManifest();

		return Promise.resolve(manifest.version);
	}
}

export default PlaintextVersionEndpoint;
