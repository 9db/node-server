import HTTP from 'http';

import Node from 'type/node';
import HttpError from 'http/error';
import HeaderMap from 'http/type/header-map';
import Repository from 'repository';
import HttpHeader from 'http/enum/header';
import HttpMethod from 'http/enum/method';
import BodyParser from 'server/body-parser';
import StatusCode from 'http/enum/status-code';
import ContentType from 'http/enum/content-type';
import ServerError from 'http/error/server-error';
import UrlParameters from 'http/type/url-parameters';
import JsonBodyParser from 'server/body-parser/json';
import BadRequestError from 'http/error/bad-request';
import parseQuerystring from 'http/utility/parse-querystring';
import UrlEncodedBodyParser from 'server/body-parser/url-encoded';
import getSuccessfulStatusCode from 'http/utility/get-successful-status-code';
import LoadAccountForRequestOperation from 'operation/load-account-for-request';

// eslint-disable-next-line @typescript-eslint/ban-types
type AllowedOutputs = string | Buffer | object;

abstract class Endpoint<Input, Output extends AllowedOutputs> {
	private request: HTTP.IncomingMessage;
	private response: HTTP.ServerResponse;
	private url_parameters: UrlParameters;
	private query_parameters: Record<string, unknown> | undefined;
	private repository: Repository;
	private status_code: StatusCode;
	private response_headers: HeaderMap;
	private request_body: Input | undefined;
	private account: Node | undefined;

	public constructor(
		request: HTTP.IncomingMessage,
		response: HTTP.ServerResponse,
		url_parameters: UrlParameters,
		repository: Repository
	) {
		this.request = request;
		this.response = response;
		this.url_parameters = url_parameters;
		this.repository = repository;
		this.status_code = getSuccessfulStatusCode(request);

		this.response_headers = {
			[HttpHeader.CONTENT_TYPE]: this.getResponseContentType()
		};
	}

	public serve(): void {
		this.serveInternal()
			.then(this.handleResult.bind(this))
			.catch(this.handleError.bind(this));
	}

	protected getRequest(): HTTP.IncomingMessage {
		return this.request;
	}

	protected getResponse(): HTTP.ServerResponse {
		return this.response;
	}

	protected setHeaderValue(header: HttpHeader, value: string): void {
		const headers = this.getResponseHeaders();

		headers[header] = value;
	}

	protected getResponseHeaders(): HeaderMap {
		return this.response_headers;
	}

	protected getUrlParameter(parameter: string): string {
		const parameters = this.getUrlParameters();
		const value = parameters[parameter];

		if (value === undefined) {
			throw new BadRequestError();
		}

		return value;
	}

	protected getQueryParameter(parameter: string): any {
		const query_parameters = this.getQueryParameters();

		return query_parameters[parameter];
	}

	protected setStatusCode(status_code: StatusCode): void {
		this.status_code = status_code;
	}

	protected getRepository(): Repository {
		return this.repository;
	}

	protected getRequestBody(): Input {
		if (this.hasUnparsableMethod()) {
			return {} as Input;
		}

		if (this.request_body === undefined) {
			throw new Error('Tried to read request body, but it was not set');
		}

		return this.request_body;
	}

	protected getAccount(): Node {
		if (this.account === undefined) {
			throw new Error('Tried to read account, but it was not set');
		}

		return this.account;
	}

	protected redirectToUrl(url: string): void {
		this.setStatusCode(StatusCode.REDIRECT);
		this.setHeaderValue(HttpHeader.LOCATION, url);

		this.sendString('');
	}

	private async serveInternal(): Promise<Output | void> {
		await this.parseBody();
		await this.loadAccount();

		return this.process();
	}

	private async parseBody(): Promise<void> {
		if (this.hasUnparsableMethod()) {
			return Promise.resolve();
		}

		const body_parser = this.getBodyParser();
		const body = await body_parser.parse();

		this.request_body = body as Input;
	}

	private async loadAccount(): Promise<void> {
		const repository = this.getRepository();
		const system_account = await repository.fetchSystemAccount();
		const request = this.getRequest();

		const input = {
			request,
			repository,
			account: system_account
		};

		const operation = new LoadAccountForRequestOperation(input);
		const account = await operation.perform();

		this.account = account;
	}

	private hasUnparsableMethod(): boolean {
		const request = this.getRequest();
		const method = request.method;

		return method === HttpMethod.GET || method === HttpMethod.OPTIONS;
	}

	private getStatusCode(): StatusCode {
		return this.status_code;
	}

	private handleResult(result: Output | void): void {
		if (result === undefined) {
			return;
		}

		if (result instanceof Buffer) {
			return this.sendData(result);
		}

		if (typeof result === 'string') {
			return this.sendString(result);
		}

		const serialized_result = JSON.stringify(result);

		return this.sendString(serialized_result);
	}

	private sendString(result: string): void {
		const buffer = Buffer.from(result);

		return this.sendData(buffer);
	}

	private sendData(data: Buffer): void {
		const response = this.getResponse();
		const status_code = this.getStatusCode();
		const headers = this.getResponseHeaders();

		this.logCompletion();

		response.writeHead(status_code, headers);
		response.end(data);
	}

	private handleError(error: Error): void {
		let http_error;

		if (error instanceof HttpError) {
			http_error = error;
		} else {
			http_error = new ServerError(error.message);
		}

		this.setStatusCode(http_error.status_code);

		const serialized_error = this.serializeError(http_error);

		return this.handleResult(serialized_error);
	}

	private logCompletion(): void {
		const url = this.getRequestUrl();
		const status_code = this.getStatusCode();

		console.log(`[${status_code}] ${url}`);
	}

	private getRequestUrl(): string {
		const request = this.getRequest();

		return request.url || '/';
	}

	private getRequestContentType(): ContentType {
		const request = this.getRequest();
		const header_value = request.headers[HttpHeader.CONTENT_TYPE];
		const content_type = header_value as ContentType;

		return content_type || ContentType.JSON;
	}

	private getUrlParameters(): UrlParameters {
		return this.url_parameters;
	}

	private getQueryParameters(): Record<string, unknown> {
		if (this.query_parameters === undefined) {
			this.query_parameters = this.parseQueryParameters();
		}

		return this.query_parameters;
	}

	private parseQueryParameters(): Record<string, unknown> {
		const url = this.getRequestUrl();
		const query_index = url.indexOf('?');

		if (query_index === -1) {
			return {};
		}

		const suffix = url.slice(query_index + 1);
		const result = parseQuerystring(suffix);

		return result as Record<string, unknown>;
	}

	private getBodyParser(): BodyParser {
		const request = this.getRequest();
		const content_type = this.getRequestContentType();

		switch (content_type) {
			case ContentType.URL_ENCODED:
				return new UrlEncodedBodyParser(request);
			case ContentType.JSON:
			default:
				return new JsonBodyParser(request);
		}
	}

	protected abstract process(): Promise<Output | void>;
	protected abstract getResponseContentType(): ContentType;
	protected abstract serializeError(error: HttpError): Output;
}

export default Endpoint;
