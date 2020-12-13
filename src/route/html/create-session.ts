import HtmlRoute from 'route/html';
import HttpMethod from 'http/enum/method';
import HtmlCreateSessionEndpoint from 'endpoint/html/create-session';

class HtmlCreateSessionRoute extends HtmlRoute {
	public constructor() {
		super(HttpMethod.POST, '/session', HtmlCreateSessionEndpoint);
	}
}

export default HtmlCreateSessionRoute;
