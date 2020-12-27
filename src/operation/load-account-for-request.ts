import HTTP from 'http';

import Node from 'type/node';
import SystemId from 'system/enum/id';
import HttpHeader from 'http/enum/header';
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

class LoadAccountForRequestOperation extends Operation<Input, Node> {
	protected async performInternal(): Promise<Node> {
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

	private async loadFromSessionId(session_id: string): Promise<Node> {
		const repository = this.getRepository();

		const session = await repository.fetchNode({
			type_id: SystemId.SESSION_TYPE,
			id: session_id
		});

		if (session === undefined) {
			return this.loadAnonymousAccount();
		}

		const url = session.account as string;
		const account = this.getAccount();

		const operation = new LoadNodeFromUrlOperation({
			repository,
			account,
			url
		});

		return operation.perform();
	}

	private loadFromBasicAuthCredentials(
		credentials: BasicAuthCredentials
	): Promise<Node> {
		const repository = this.getRepository();
		const account = this.getAccount();

		const operation = new FetchAccountOperation({
			repository,
			account,
			credentials
		});

		return operation.perform();
	}

	private async loadAnonymousAccount(): Promise<Node> {
		const repository = this.getRepository();

		const node = await repository.fetchNode({
			type_id: SystemId.ACCOUNT_TYPE,
			id: SystemId.ANONYMOUS_ACCOUNT
		});

		return node as Node;
	}

	private getRequest(): HTTP.IncomingMessage {
		const input = this.getInput();

		return input.request;
	}
}

export default LoadAccountForRequestOperation;
