import Node from 'type/node';
import SystemId from 'system/enum/id';
import HttpHeader from 'http/enum/header';
import buildCookie from 'http/utility/build-cookie';
import HtmlEndpoint from 'endpoint/html';
import TimeInterval from 'enum/time-interval';
import KeyGenerator from 'utility/key-generator';
import getNodeParameters from 'utility/get-node-parameters';
import FetchAccountOperation from 'operation/fetch-account';
import CreateInstanceOperation from 'operation/create-instance';

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
		const id = KeyGenerator.id();
		const repository = this.getRepository();
		const system_account = await repository.fetchSystemAccount();

		const input = {
			id,
			type_id: SystemId.SESSION_TYPE,
			fields: [
				{
					key: 'account',
					value: account.url
				}
			],
			repository,
			account: system_account
		};

		const operation = new CreateInstanceOperation(input);

		return operation.perform();
	}

	private setCookieFromSession(session: Node): void {
		const session_parameters = getNodeParameters(session);
		const cookie = buildCookie(session_parameters.id, TimeInterval.ONE_DAY);

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
