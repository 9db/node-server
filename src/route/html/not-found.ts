import HTTP from 'http';

import HtmlRoute from 'route/html';
import HttpMethod from 'http/enum/method';
import HtmlNotFoundEndpoint from 'endpoint/html/not-found';

class HtmlNotFoundRoute extends HtmlRoute {
	public constructor() {
		super(HttpMethod.GET, '/404', HtmlNotFoundEndpoint);
	}

	public accepts(request: HTTP.IncomingMessage): boolean {
		return this.matchesContentType(request);
	}
}

export default HtmlNotFoundRoute;
