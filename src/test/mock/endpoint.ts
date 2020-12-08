import Endpoint from 'endpoint';
import HttpError from 'http/error';

class MockEndpoint extends Endpoint {
	protected process(): Promise<string> {
		throw new Error('Not implemented');
	}

	protected serializeError(_error: HttpError): string {
		throw new Error('Not implemented');
	}
}

export default MockEndpoint;
