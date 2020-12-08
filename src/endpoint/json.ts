import Endpoint from 'endpoint';
import HttpError from 'http/error';
import JsonObject from 'http/type/json-object';
import ContentType from 'http/enum/content-type';

abstract class JsonEndpoint extends Endpoint {
	protected static content_type = ContentType.JSON;

	protected serializeError(error: HttpError): JsonObject {
		return {
			message: error.message,
		};
	}
}

export default JsonEndpoint;
