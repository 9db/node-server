import HtmlRoute from 'route/html';
import HttpMethod from 'http/enum/method';
import HtmlCreateTypeFormEndpoint from 'endpoint/html/create-type-form';

class HtmlCreateTypeFormRoute extends HtmlRoute {
	public constructor() {
		super(HttpMethod.GET, '/create-type', HtmlCreateTypeFormEndpoint);
	}
}

export default HtmlCreateTypeFormRoute;
