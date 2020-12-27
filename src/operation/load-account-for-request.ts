import HTTP from 'http';

import SystemId from 'system/enum/id';
import HttpHeader from 'http/enum/header';
import AccountNode from 'type/node/account';
import SessionNode from 'type/node/session';
import parseCookie from 'http/utility/parse-cookie';
import getHeaderValue from 'http/utility/get-header-value';
import CookieAttribute from 'http/enum/cookie-attribute';
import BasicAuthCredentials from 'http/type/basic-auth-credentials';
import FetchAccountOperation from 'operation/fetch-account';
import LoadNodeFromUrlOperation from 'operation/load-node-from-url';
import Operation, { OperationInput } from 'operation';

interface Input extends OperationInput {
	readonly request: HTTP.IncomingMessage;
}

class LoadAccountForRequestOperation extends Operation<Input, AccountNode> {
	protected async performInternal(): Promise<AccountNode> {
		const session_id = this.getSessionId();

		if (session_id !== undefined) {
			return this.loadFromSessionId(session_id);
		}

		const basic_auth_credentials = this.getBasicAuthCredentials();

		if (basic_auth_credentials !== undefined) {
			return this.loadFromBasicAuthCredentials(basic_auth_credentials);
		}

		return this.loadAnonymousAccount();
	}

	private getSessionId(): string | undefined {
		const request = this.getRequest();
		const header = getHeaderValue(request, HttpHeader.COOKIE);

		if (header === undefined) {
			return undefined;
		}

		const parsed_cookie = parseCookie(header);

		return parsed_cookie[CookieAttribute.SESSION] as string | undefined;
	}

	private getBasicAuthCredentials(): BasicAuthCredentials | undefined {
		/*
		const request = this.getRequest();
		const header = getHeaderValue(request, HttpHeader.AUTHORIZATION);
		*/

		return undefined;
	}

	private async loadFromSessionId(session_id: string): Promise<AccountNode> {
		const repository = this.getRepository();

		const node = await repository.fetchNode({
			type_id: SystemId.SESSION_TYPE,
			id: session_id
		});

		const session = node as SessionNode;

		if (session === undefined) {
			return this.loadAnonymousAccount();
		}

		const account = this.getAccount();
		const url = session.account;

		const operation = new LoadNodeFromUrlOperation({
			repository,
			account,
			url
		});

		const result = await operation.perform();

		return result as AccountNode;
	}

	private loadFromBasicAuthCredentials(
		credentials: BasicAuthCredentials
	): Promise<AccountNode> {
		const repository = this.getRepository();
		const account = this.getAccount();

		const operation = new FetchAccountOperation({
			repository,
			account,
			credentials
		});

		return operation.perform();
	}

	private async loadAnonymousAccount(): Promise<AccountNode> {
		const repository = this.getRepository();

		const node = await repository.fetchNode({
			type_id: SystemId.ACCOUNT_TYPE,
			id: SystemId.ANONYMOUS_ACCOUNT
		});

		return node as AccountNode;
	}

	private getRequest(): HTTP.IncomingMessage {
		const input = this.getInput();

		return input.request;
	}
}

export default LoadAccountForRequestOperation;
