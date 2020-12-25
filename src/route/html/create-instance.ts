import HtmlRoute from 'route/html';
import HttpMethod from 'http/enum/method';
import HtmlCreateInstanceEndpoint from 'endpoint/html/create-instance';

class HtmlCreateInstanceRoute extends HtmlRoute {
	public constructor() {
		super(HttpMethod.POST, '/:type_id', HtmlCreateInstanceEndpoint);
	}
}

export default HtmlCreateInstanceRoute;
