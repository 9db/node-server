import HtmlRoute from 'route/html';
import HttpMethod from 'http/enum/method';
import HtmlCreateInstanceFormEndpoint from 'endpoint/html/create-instance-form';

class HtmlCreateInstanceFormRoute extends HtmlRoute {
	public constructor() {
		super(HttpMethod.GET, '/create-instance', HtmlCreateInstanceFormEndpoint);
	}
}

export default HtmlCreateInstanceFormRoute;
