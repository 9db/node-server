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

	public constructor(
		request: HTTP.IncomingMessage,
		response: HTTP.ServerResponse
	) {
		this.request = request;
		this.response = response;
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

	private handleResult(result: string | Buffer | void): void {
		if (result === undefined) {
			return;
		}

		const response = this.getResponse();
		const headers = this.getResponseHeaders();

		response.writeHead(StatusCode.SUCCESS, headers);
		response.end(result);
	}

	private handleError(error: Error): void {
		if (error instanceof HttpError) {
			return this.serveError(error);
		}

		const server_error = new ServerError(error.message);

		return this.serveError(server_error);
	}

	private getContentType(): ContentType {
		const Constructor = this.getConstructor();

		return Constructor.content_type;
	}

	private getConstructor(): typeof Endpoint {
		return <typeof Endpoint>this.constructor;
	}

	protected abstract process(): Promise<string | Buffer | void>;
	protected abstract serveError(error: HttpError): void;
}

export default Endpoint;
