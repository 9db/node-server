import BodyParser from 'server/body-parser';
import JsonObject from 'http/type/json-object';
import parseQuerystring from 'http/utility/parse-querystring';

class UrlEncodedBodyParser extends BodyParser {
	protected transformBuffer(buffer: Buffer): JsonObject {
		const querystring = buffer.toString('utf8');

		return parseQuerystring(querystring);
	}
}

export default UrlEncodedBodyParser;
