import BodyParser from 'server/body-parser';
import JsonObject from 'http/type/json-object';

class UrlEncodedBodyParser extends BodyParser {
	protected transformBuffer(_buffer: Buffer): JsonObject {
		return {};
	}
}

export default UrlEncodedBodyParser;
