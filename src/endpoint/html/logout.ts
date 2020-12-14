import Node from 'type/node';
import SystemKey from 'system/enum/key';
import HttpHeader from 'http/enum/header';
import buildCookie from 'http/utility/build-cookie';
import HtmlEndpoint from 'endpoint/html';
import LogoutPageTemplate from 'template/page/logout';
import FetchNodeOperation from 'operation/fetch-node';

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
		const input = {
			namespace_key: SystemKey.SYSTEM_NAMESPACE,
			type_key: SystemKey.ACCOUNT_TYPE,
			key: SystemKey.ANONYMOUS_ACCOUNT
		};

		const repository = this.getRepository();
		const operation = new FetchNodeOperation(repository, input);

		return operation.perform();
	}
}

export default HtmlLogoutEndpoint;
