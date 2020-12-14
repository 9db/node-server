import Node from 'type/node';
import SystemKey from 'system/enum/key';
import HttpHeader from 'http/enum/header';
import buildCookie from 'http/utility/build-cookie';
import HtmlEndpoint from 'endpoint/html';
import TimeInterval from 'enum/time-interval';
import KeyGenerator from 'utility/key-generator';
import CreateNodeOperation from 'operation/create-node';
import FetchAccountOperation from 'operation/fetch-account';

interface Input {
	readonly username: string;
	readonly password: string;
}

class HtmlCreateSessionEndpoint extends HtmlEndpoint<Input> {
	protected async process(): Promise<void> {
		const account = await this.fetchAccount();
		const session = await this.createSession(account);

		this.setCookieFromSession(session);
		this.redirectToUrl('/');
	}

	private async fetchAccount(): Promise<Node> {
		const repository = this.getRepository();
		const account = await repository.fetchSystemAccount();

		const credentials = {
			username: this.getUsername(),
			password: this.getPassword()
		};

		const input = {
			credentials,
			repository,
			account
		};

		const operation = new FetchAccountOperation(input);

		return operation.perform();
	}

	private async createSession(account: Node): Promise<Node> {
		const key = KeyGenerator.id();
		const repository = this.getRepository();
		const system_account = await repository.fetchSystemAccount();
		const account_url = repository.buildNodeUrl(account);

		const node = {
			namespace_key: SystemKey.SYSTEM_NAMESPACE,
			type_key: SystemKey.SESSION_TYPE,
			key,
			account: account_url
		};

		const input = {
			node,
			repository,
			account: system_account
		};

		const operation = new CreateNodeOperation(input);

		return operation.perform();
	}

	private setCookieFromSession(session: Node): void {
		const cookie = buildCookie(session.key, TimeInterval.ONE_DAY);

		this.setHeaderValue(HttpHeader.SET_COOKIE, cookie);
	}

	private getUsername(): string {
		const request_body = this.getRequestBody();

		return request_body.username;
	}

	private getPassword(): string {
		const request_body = this.getRequestBody();

		return request_body.password;
	}
}

export default HtmlCreateSessionEndpoint;
