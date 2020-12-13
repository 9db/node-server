import HtmlEndpoint from 'endpoint/html';
import NotFoundError from 'http/error/not-found';

class HtmlNotFoundEndpoint extends HtmlEndpoint<Record<string, never>> {
	protected async process(): Promise<string> {
		throw new NotFoundError();
	}
}

export default HtmlNotFoundEndpoint;
