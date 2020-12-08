import Endpoint from 'endpoint';
import HttpError from 'http/error';
import JsonObject from 'http/type/json-object';

abstract class JsonEndpoint extends Endpoint {
	protected serializeError(error: HttpError): JsonObject {
		return {
			message: error.message,
		};
	}
}

export default JsonEndpoint;
