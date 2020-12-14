import HTTP from 'http';

import Node from 'type/node';
import Operation from 'operation';
import SystemKey from 'system/enum/key';
import Repository from 'repository';
import HttpHeader from 'http/enum/header';
import parseCookie from 'http/utility/parse-cookie';
import getHeaderValue from 'http/utility/get-header-value';
import CookieAttribute from 'http/enum/cookie-attribute';
import BasicAuthCredentials from 'http/type/basic-auth-credentials';
import FetchAccountOperation from 'operation/fetch-account';
import LoadNodeFromUrlOperation from 'operation/load-node-from-url';

class LoadAccountForRequestOperation extends Operation<Node> {
	private request: HTTP.IncomingMessage;

	public constructor(repository: Repository, request: HTTP.IncomingMessage) {
		super(repository);

		this.request = request;
	}

	protected async performInternal(): Promise<Node> {
		const session_key = this.getSessionKey();

		if (session_key !== undefined) {
			return this.loadFromSessionKey(session_key);
		}

		const basic_auth_credentials = this.getBasicAuthCredentials();

		if (basic_auth_credentials !== undefined) {
			return this.loadFromBasicAuthCredentials(basic_auth_credentials);
		}

		return this.loadAnonymousAccount();
	}

	private getSessionKey(): string | undefined {
		const request = this.getRequest();
		const header = getHeaderValue(request, HttpHeader.COOKIE);

		if (header === undefined) {
			return undefined;
		}

		const parsedCookie = parseCookie(header);

		return parsedCookie[CookieAttribute.SESSION] as string | undefined;
	}

	private getBasicAuthCredentials(): BasicAuthCredentials | undefined {
		/*
		const request = this.getRequest();
		const header = getHeaderValue(request, HttpHeader.AUTHORIZATION);
		*/

		return undefined;
	}

	private async loadFromSessionKey(session_key: string): Promise<Node> {
		const repository = this.getRepository();

		const session = await repository.fetchNode(
			SystemKey.SYSTEM_NAMESPACE,
			SystemKey.SESSION_TYPE,
			session_key
		);

		if (session === undefined) {
			return this.loadAnonymousAccount();
		}

		const account_url = session.account as string;
		const operation = new LoadNodeFromUrlOperation(repository, account_url);

		return operation.perform();
	}

	private loadFromBasicAuthCredentials(
		credentials: BasicAuthCredentials
	): Promise<Node> {
		const repository = this.getRepository();
		const operation = new FetchAccountOperation(repository, credentials);

		return operation.perform();
	}

	private async loadAnonymousAccount(): Promise<Node> {
		const repository = this.getRepository();

		const node = await repository.fetchNode(
			SystemKey.SYSTEM_NAMESPACE,
			SystemKey.ACCOUNT_TYPE,
			SystemKey.ANONYMOUS_ACCOUNT
		);

		return node as Node;
	}

	private getRequest(): HTTP.IncomingMessage {
		return this.request;
	}
}

export default LoadAccountForRequestOperation;
