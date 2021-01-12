import HtmlRoute from 'route/html';
import HttpMethod from 'http/enum/method';
import HtmlCreateTypeFormEndpoint from 'endpoint/html/create-type-form';

class HtmlUpdateTypeFormRoute extends HtmlRoute {
	public constructor() {
		super(HttpMethod.POST, '/create-type', HtmlCreateTypeFormEndpoint);
	}
}

export default HtmlUpdateTypeFormRoute;
