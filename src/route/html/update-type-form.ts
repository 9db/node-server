import HtmlRoute from 'route/html';
import HttpMethod from 'http/enum/method';
import HtmlTypeFormEndpoint from 'endpoint/html/type-form';

class HtmlUpdateTypeFormRoute extends HtmlRoute {
	public constructor() {
		super(HttpMethod.POST, '/create-type', HtmlTypeFormEndpoint);
	}
}

export default HtmlUpdateTypeFormRoute;
