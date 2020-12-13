import Endpoint from 'endpoint';
import HttpError from 'http/error';
import ContentType from 'http/enum/content-type';

abstract class PlaintextEndpoint<Input extends object> extends Endpoint<Input, string> {
	protected serializeError(error: HttpError): string {
		return error.message;
	}

	protected getResponseContentType(): ContentType {
		return ContentType.TEXT;
	}
}

export default PlaintextEndpoint;
