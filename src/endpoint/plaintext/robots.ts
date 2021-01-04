import PlaintextEndpoint from 'endpoint/plaintext';

class PlaintextRobotsEndpoint extends PlaintextEndpoint<
	Record<string, never>
> {
	protected process(): Promise<string> {
		const lines = [
			'User-agent: *',
			'Disallow: /'
		];

		const contents = lines.join('\n');

		return Promise.resolve(contents);
	}
}

export default PlaintextRobotsEndpoint;
