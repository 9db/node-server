import HtmlEndpoint from 'endpoint/html';

class HtmlFieldDetailsEndpoint extends HtmlEndpoint<Record<string, never>> {
	protected async process(): Promise<string> {
		return Promise.resolve(
			'<html><head><title>x</title></head><body>foo</body></html>'
		);
	}
}

export default HtmlFieldDetailsEndpoint;
