import HTTP from 'http';

import ContentType from 'http/enum/content-type';

interface Route {
	accepts(request: HTTP.IncomingMessage): boolean;
	serve(request: HTTP.IncomingMessage, response: HTTP.ServerResponse): void;
	getContentType(): ContentType;
	getUrlParameter(url: string, parameter: string): string | undefined;
}

export default Route;
