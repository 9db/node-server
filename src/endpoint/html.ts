import Endpoint from 'endpoint';
import HttpError from 'http/error';
import ContentType from 'http/enum/content-type';
import ErrorPageTemplate from 'template/page/error';

abstract class HtmlEndpoint<Input> extends Endpoint<Input, string> {
	protected serializeError(error: HttpError): string {
		const account = this.getAccount();

		const template = new ErrorPageTemplate({
			error,
			account
		});

		return template.render();
	}

	protected getResponseContentType(): ContentType {
		return ContentType.HTML;
	}
}

export default HtmlEndpoint;
