import Endpoint from 'endpoint';
import HttpError from 'http/error';
import BodyParser from 'server/body-parser';

class MockEndpoint extends Endpoint<string> {
	protected process(): Promise<string | Buffer | void> {
		throw new Error('Not implemented');
	}

	protected serializeError(_error: HttpError): string {
		throw new Error('Not implemented');
	}

	protected getBodyParser(): BodyParser<string> {
		throw new Error('Not implemented');
	}
}

export default MockEndpoint;
