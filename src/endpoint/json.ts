import Endpoint from 'endpoint';
import HttpError from 'http/error';
import JsonObject from 'http/type/json-object';
import JsonBodyParser from 'server/body-parser/json';

abstract class JsonEndpoint extends Endpoint<JsonObject> {
	protected serializeError(error: HttpError): JsonObject {
		return {
			message: error.message,
		};
	}

	protected getBodyParser(): JsonBodyParser {
		const request = this.getRequest();

		return new JsonBodyParser(request);
	}
}

export default JsonEndpoint;
