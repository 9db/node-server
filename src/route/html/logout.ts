import HtmlRoute from 'route/html';
import HttpMethod from 'http/enum/method';
import HtmlLogoutEndpoint from 'endpoint/html/logout';

class HtmlLogoutRoute extends HtmlRoute {
	public constructor() {
		super(HttpMethod.GET, '/logout', HtmlLogoutEndpoint);
	}
}

export default HtmlLogoutRoute;
