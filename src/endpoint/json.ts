import Endpoint from 'endpoint';
import HttpError from 'http/error';
import JsonObject from 'http/type/json-object';
import ContentType from 'http/enum/content-type';

abstract class JsonEndpoint<Input> extends Endpoint<Input, JsonObject> {
	protected serializeError(error: HttpError): JsonObject {
		return {
			message: error.message
		};
	}

	protected getResponseContentType(): ContentType {
		return ContentType.JSON;
	}
}

export default JsonEndpoint;
