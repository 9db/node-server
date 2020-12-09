import BodyParser from 'server/body-parser';
import JsonObject from 'http/type/json-object';

class JsonBodyParser extends BodyParser<JsonObject> {
	protected transformBuffer(buffer: Buffer): JsonObject {
		const string_body = buffer.toString('utf8');

		return JSON.parse(string_body);
	}
}

export default JsonBodyParser;
