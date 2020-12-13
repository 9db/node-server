import HtmlEndpoint from 'endpoint/html';
import NodePageTemplate from 'template/page/node';

class HtmlNodePageEndpoint extends HtmlEndpoint<Record<string, never>> {
	protected async process(): Promise<string> {
		const template = new NodePageTemplate();
		const html = template.render();

		return Promise.resolve(html);
	}
}

export default HtmlNodePageEndpoint;
