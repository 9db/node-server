import HTTP from 'http';

import Route from 'interface/route';
import Adapter from 'interface/adapter';
import HttpError from 'http/error';
import HeaderMap from 'http/type/header-map';
import HttpHeader from 'http/enum/header';
import JsonObject from 'http/type/json-object';
import StatusCode from 'http/enum/status-code';
import ContentType from 'http/enum/content-type';
import ServerError from 'http/error/server-error';
import BadRequestError from 'http/error/bad-request';

abstract class Endpoint {
	private request: HTTP.IncomingMessage;
	private response: HTTP.ServerResponse;
	private route: Route;
	private adapter: Adapter;
	private status_code: StatusCode;

	public constructor(
		request: HTTP.IncomingMessage,
		response: HTTP.ServerResponse,
		route: Route,
		adapter: Adapter
	) {
		this.request = request;
		this.response = response;
		this.route = route;
		this.adapter = adapter;
		this.status_code = StatusCode.SUCCESS;
	}

	public serve(): void {
		this.process()
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
		const url = this.getUrl();
		const route = this.getRoute();
		const value = route.getUrlParameter(url, parameter);

		if (value === undefined) {
			throw new BadRequestError();
		}

		return value;
	}

	protected setStatusCode(status_code: StatusCode): void {
		this.status_code = status_code;
	}

	protected getAdapter(): Adapter {
		return this.adapter;
	}

	private getUrl(): string {
		const request = this.getRequest();

		return request.url || '/';
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

	private getContentType(): ContentType {
		const route = this.getRoute();

		return route.getContentType();
	}

	private getRoute(): Route {
		return this.route;
	}

	protected abstract process(): Promise<string | Buffer | JsonObject | void>;
	protected abstract serializeError(
		error: HttpError
	): string | Buffer | JsonObject;
}

export default Endpoint;
