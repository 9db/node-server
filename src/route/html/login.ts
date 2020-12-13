import HtmlRoute from 'route/html';
import HttpMethod from 'http/enum/method';
import HtmlLoginEndpoint from 'endpoint/html/login';

class HtmlLoginRoute extends HtmlRoute {
	public constructor() {
		super(HttpMethod.GET, '/login', HtmlLoginEndpoint);
	}
}

export default HtmlLoginRoute;
