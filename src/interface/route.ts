import HTTP from 'http';

import Adapter from 'interface/adapter';
import ContentType from 'http/enum/content-type';

interface Route {
	accepts(request: HTTP.IncomingMessage): boolean;

	serve(
		request: HTTP.IncomingMessage,
		response: HTTP.ServerResponse,
		adapter: Adapter
	): void;

	getContentType(): ContentType;
	getUrlParameter(url: string, parameter: string): string | undefined;
}

export default Route;
