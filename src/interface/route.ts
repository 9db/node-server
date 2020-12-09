import HTTP from 'http';

import Adapter from 'interface/adapter';
import HttpMethod from 'http/enum/method';
import StatusCode from 'http/enum/status-code';
import ContentType from 'http/enum/content-type';

interface Route {
	accepts(request: HTTP.IncomingMessage): boolean;

	serve(
		request: HTTP.IncomingMessage,
		response: HTTP.ServerResponse,
		adapter: Adapter
	): void;

	getContentType(): ContentType;
	getMethod(): HttpMethod;
	getSuccessfulStatusCode(): StatusCode;
	getUrlParameter(url: string, parameter: string): string | undefined;
}

export default Route;
