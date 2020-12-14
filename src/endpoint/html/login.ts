import HtmlEndpoint from 'endpoint/html';
import LoginPageTemplate from 'template/page/login';

class HtmlLoginEndpoint extends HtmlEndpoint<Record<string, never>> {
	protected async process(): Promise<string> {
		const account = this.getAccount();

		const template = new LoginPageTemplate({
			account
		});

		const html = template.render();

		return Promise.resolve(html);
	}
}

export default HtmlLoginEndpoint;
