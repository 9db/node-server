import BodyParser from 'server/body-parser';

class StringBodyParser extends BodyParser<string> {
	protected transformBuffer(buffer: Buffer): string {
		return buffer.toString('utf8');
	}
}

export default StringBodyParser;
