import HTTP from 'http';

import HttpError from 'http/error';
import HeaderMap from 'http/type/header-map';
import Repository from 'repository';
import HttpHeader from 'http/enum/header';
import HttpMethod from 'http/enum/method';
import BodyParser from 'server/body-parser';
import JsonObject from 'http/type/json-object';
import StatusCode from 'http/enum/status-code';
import ContentType from 'http/enum/content-type';
import ServerError from 'http/error/server-error';
import UrlParameters from 'http/type/url-parameters';
import BadRequestError from 'http/error/bad-request';
import getSuccessfulStatusCode from 'http/utility/get-successful-status-code';

abstract class Endpoint<T> {
	private request: HTTP.IncomingMessage;
	private response: HTTP.ServerResponse;
	private url_parameters: UrlParameters;
	private repository: Repository;
	private status_code: StatusCode;
	private request_body: T | undefined;

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
	}

	public serve(): void {
		this.parseBody()
			.then(this.process.bind(this))
			.then(this.handleResult.bind(this))
			.catch(this.handleError.bind(this));
	}

	protected getRequest(): HTTP.IncomingMessage {
		return this.request;
	}

	protected getResponse(): HTTP.ServerResponse {
		return this.response;
	}

	protected getResponseHeaders(): HeaderMap {
		return {
			[HttpHeader.CONTENT_TYPE]: this.getContentType(),
		};
	}

	protected getUrlParameter(parameter: string): string {
		const parameters = this.getUrlParameters();
		const value = parameters[parameter];

		if (value === undefined) {
			throw new BadRequestError();
		}

		return value;
	}

	protected setStatusCode(status_code: StatusCode): void {
		this.status_code = status_code;
	}

	protected getRepository(): Repository {
		return this.repository;
	}

	protected getRequestBody(): T {
		if (this.request_body === undefined) {
			throw new Error('Tried to read request body, but it was not set');
		}

		return this.request_body;
	}

	private async parseBody(): Promise<void> {
		if (this.hasUnparsableMethod()) {
			return Promise.resolve();
		}

		const body_parser = this.getBodyParser();

		this.request_body = await body_parser.parse();
	}

	private hasUnparsableMethod(): boolean {
		const request = this.getRequest();
		const method = request.method;

		return method === HttpMethod.GET || method === HttpMethod.OPTIONS;
	}

	private getStatusCode(): StatusCode {
		return this.status_code;
	}

	private handleResult(result: string | Buffer | JsonObject | void): void {
		if (result === undefined) {
			return;
		}

		if (result instanceof Buffer) {
			return this.sendData(result);
		}

		if (typeof result !== 'string') {
			result = JSON.stringify(result);
		}

		const buffer = Buffer.from(result);

		return this.sendData(buffer);
	}

	private sendData(data: Buffer): void {
		const response = this.getResponse();
		const status_code = this.getStatusCode();
		const headers = this.getResponseHeaders();

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

	private getUrlParameters(): UrlParameters {
		return this.url_parameters;
	}

	protected abstract process(): Promise<string | Buffer | JsonObject | void>;
	protected abstract getBodyParser(): BodyParser<T>;
	protected abstract getContentType(): ContentType;
	protected abstract serializeError(
		error: HttpError
	): string | Buffer | JsonObject;
}

export default Endpoint;
