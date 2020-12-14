import HtmlRoute from 'route/html';
import HttpMethod from 'http/enum/method';
import HtmlHomeEndpoint from 'endpoint/html/home';

class HtmlHomeRoute extends HtmlRoute {
	public constructor() {
		super(HttpMethod.GET, '/', HtmlHomeEndpoint);
	}
}

export default HtmlHomeRoute;
