import Endpoint from 'endpoint';
import HttpError from 'http/error';
import ContentType from 'http/enum/content-type';
import ErrorPageTemplate from 'template/page/error';

abstract class HtmlEndpoint<Input extends object> extends Endpoint<Input, string> {
	protected serializeError(error: HttpError): string {
		const template = new ErrorPageTemplate({
			error
		});

		return template.render();
	}

	protected getResponseContentType(): ContentType {
		return ContentType.HTML;
	}
}

export default HtmlEndpoint;
