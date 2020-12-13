import BodyParser from 'server/body-parser';

class JsonBodyParser extends BodyParser {
	protected transformBuffer(buffer: Buffer): object {
		const string_body = buffer.toString('utf8');

		return JSON.parse(string_body);
	}
}

export default JsonBodyParser;
