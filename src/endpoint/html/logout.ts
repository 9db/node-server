import Node from 'type/node';
import HttpHeader from 'http/enum/header';
import buildCookie from 'http/utility/build-cookie';
import HtmlEndpoint from 'endpoint/html';
import LogoutPageTemplate from 'template/page/logout';

class HtmlLogoutEndpoint extends HtmlEndpoint<Record<string, never>> {
	protected async process(): Promise<string> {
		this.clearCookie();

		const account = await this.loadAnonymousAccount();

		const template = new LogoutPageTemplate({
			account
		});

		const html = template.render();

		return Promise.resolve(html);
	}

	private clearCookie(): void {
		const cookie = buildCookie('', 0);

		this.setHeaderValue(HttpHeader.SET_COOKIE, cookie);
	}

	private loadAnonymousAccount(): Promise<Node> {
		const repository = this.getRepository();

		return repository.fetchAnonymousAccount();
	}
}

export default HtmlLogoutEndpoint;
