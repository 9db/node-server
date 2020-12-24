import HtmlRoute from 'route/html';
import HttpMethod from 'http/enum/method';
import HtmlCreateTypeEndpoint from 'endpoint/html/create-type';

class HtmlCreateTypeRoute extends HtmlRoute {
	public constructor() {
		super(HttpMethod.POST, '/type', HtmlCreateTypeEndpoint);
	}
}

export default HtmlCreateTypeRoute;
