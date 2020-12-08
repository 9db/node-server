import Endpoint from 'endpoint';
import HttpError from 'http/error';
import ContentType from 'http/enum/content-type';

abstract class PlaintextEndpoint extends Endpoint {
	protected static content_type = ContentType.TEXT;

	protected serializeError(error: HttpError): string {
		return error.message;
	}
}

export default PlaintextEndpoint;
