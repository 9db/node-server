import HtmlEndpoint from 'endpoint/html';
import HomePageTemplate from 'template/page/home';

class HtmlHomeEndpoint extends HtmlEndpoint<Record<string, never>> {
	protected async process(): Promise<string> {
		const account = this.getAccount();

		const template = new HomePageTemplate({
			account
		});

		const html = template.render();

		return Promise.resolve(html);
	}
}

export default HtmlHomeEndpoint;
