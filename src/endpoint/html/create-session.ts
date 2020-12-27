import SystemId from 'system/enum/id';
import HttpHeader from 'http/enum/header';
import AccountNode from 'type/node/account';
import SessionNode from 'type/node/session';
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

	private async fetchAccount(): Promise<AccountNode> {
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

	private async createSession(account: AccountNode): Promise<SessionNode> {
		const id = KeyGenerator.id();
		const type_id = SystemId.SESSION_TYPE;

		const node_parameters = {
			type_id,
			id
		};

		const fields = [
			{
				key: 'account',
				value: account.url
			}
		];

		const repository = this.getRepository();
		const system_account = await repository.fetchSystemAccount();

		const input = {
			node_parameters,
			fields,
			repository,
			account: system_account
		};

		const operation = new CreateInstanceOperation(input);
		const node = await operation.perform();

		return node as SessionNode;
	}

	private setCookieFromSession(session: SessionNode): void {
		const session_parameters = getNodeParameters(session.url);
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
