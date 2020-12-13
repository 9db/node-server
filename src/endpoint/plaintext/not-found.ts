import NotFoundError from 'http/error/not-found';
import PlaintextEndpoint from 'endpoint/plaintext';

class PlaintextNotFoundEndpoint extends PlaintextEndpoint<
	Record<string, never>
> {
	protected async process(): Promise<undefined> {
		throw new NotFoundError();
	}
}

export default PlaintextNotFoundEndpoint;
