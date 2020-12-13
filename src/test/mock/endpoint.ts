import Endpoint from 'endpoint';
import HttpError from 'http/error';
import ContentType from 'http/enum/content-type';

class MockEndpoint<Input extends object> extends Endpoint<Input, string> {
	protected process(): Promise<string | Buffer | void> {
		throw new Error('Not implemented');
	}

	protected serializeError(_error: HttpError): string {
		throw new Error('Not implemented');
	}

	protected getResponseContentType(): ContentType {
		throw new Error('Not implemented');
	}
}

export default MockEndpoint;
