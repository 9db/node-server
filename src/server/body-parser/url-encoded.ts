import Querystring from 'querystring';

import BodyParser from 'server/body-parser';
import JsonObject from 'http/type/json-object';

class UrlEncodedBodyParser extends BodyParser {
	protected transformBuffer(buffer: Buffer): JsonObject {
		const string_body = buffer.toString('utf8');

		return Querystring.parse(string_body);
	}
}

export default UrlEncodedBodyParser;
