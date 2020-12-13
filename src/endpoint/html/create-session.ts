import Node from 'type/node';
import SystemKey from 'system/enum/key';
import HttpHeader from 'http/enum/header';
import buildCookie from 'http/utility/build-cookie';
import HtmlEndpoint from 'endpoint/html';
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

	private fetchAccount(): Promise<Node> {
		const repository = this.getRepository();

		const input = {
			username: this.getUsername(),
			password: this.getPassword()
		};

		const operation = new FetchAccountOperation(repository, input);

		return operation.perform();
	}

	private createSession(account: Node): Promise<Node> {
		const key = KeyGenerator.id();
		const repository = this.getRepository();

		const input = {
			namespace_key: SystemKey.SYSTEM_NAMESPACE,
			type_key: SystemKey.SESSION_TYPE,
			key
		};

		const operation = new CreateNodeOperation(repository, input);

		return operation.perform();
	}

	private setCookieFromSession(session: Node): void {
		const cookie = buildCookie(session.key);

		this.setHeaderValue(HttpHeader.COOKIE, cookie);
	}

	private getUsername(): string {
		const request_body = this.getRequestBody();

		return request_body.username;
	}

	private getPassword(): string {
		const request_body = this.getRequestBody();

		return request_body.username;
	}
}

export default HtmlCreateSessionEndpoint;
