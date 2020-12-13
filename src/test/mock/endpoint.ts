import Endpoint from 'endpoint';
import HttpError from 'http/error';
import JsonObject from 'http/type/json-object';
import ContentType from 'http/enum/content-type';

type AllowedOutput = string | Buffer | JsonObject;

class MockEndpoint<Input, Output extends AllowedOutput> extends Endpoint<
	Input,
	Output
> {
	protected process(): Promise<Output | void> {
		throw new Error('Not implemented');
	}

	protected serializeError(_error: HttpError): Output {
		throw new Error('Not implemented');
	}

	protected getResponseContentType(): ContentType {
		throw new Error('Not implemented');
	}
}

export default MockEndpoint;
