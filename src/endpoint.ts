import HTTP from 'http';

import HttpError from 'http/error';
import HeaderMap from 'http/type/header-map';
import HttpHeader from 'http/enum/header';
import HttpMethod from 'http/enum/method';
import StatusCode from 'http/enum/status-code';
import ContentType from 'http/enum/content-type';
import ServerError from 'http/error/server-error';
import getAcceptedContentTypes from 'http/utility/get-accepted-content-types';

abstract class Endpoint {
	protected static url: string;
	protected static method: HttpMethod;
	protected static content_type: ContentType;

	public static accepts(request: HTTP.IncomingMessage): boolean {
		if (this.url !== request.url) {
			return false;
		}

		if (this.method !== request.method) {
			return false;
		}

		const content_types = getAcceptedContentTypes(request);

		return content_types.includes(this.content_type);
	}

	private request: HTTP.IncomingMessage;
	private response: HTTP.ServerResponse;
	private status_code: StatusCode;

	public constructor(
		request: HTTP.IncomingMessage,
		response: HTTP.ServerResponse
	) {
		this.request = request;
		this.response = response;
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

	protected setStatusCode(status_code: StatusCode): void {
		this.status_code = status_code;
	}

	private getStatusCode(): StatusCode {
		return this.status_code;
	}

	private handleResult(result: string | Buffer | object | void): void {
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
		const Constructor = this.getConstructor();

		return Constructor.content_type;
	}

	private getConstructor(): typeof Endpoint {
		return <typeof Endpoint>this.constructor;
	}

	protected abstract process(): Promise<string | Buffer | void>;
	protected abstract serializeError(error: HttpError): string | Buffer | object;
}

export default Endpoint;
