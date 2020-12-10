import Endpoint from 'endpoint';
import HttpError from 'http/error';
import ContentType from 'http/enum/content-type';
import StringBodyParser from 'server/body-parser/string';

abstract class PlaintextEndpoint extends Endpoint<string> {
	protected serializeError(error: HttpError): string {
		return error.message;
	}

	protected getContentType(): ContentType {
		return ContentType.TEXT;
	}

	protected getBodyParser(): StringBodyParser {
		const request = this.getRequest();

		return new StringBodyParser(request);
	}
}

export default PlaintextEndpoint;
