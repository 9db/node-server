import BodyParser from 'server/body-parser';

class HtmlBodyParser extends BodyParser {
	protected transformBuffer(buffer: Buffer): object {
		return {};
	}
}

export default HtmlBodyParser;
