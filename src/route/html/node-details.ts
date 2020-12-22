import HtmlRoute from 'route/html';
import HttpMethod from 'http/enum/method';
import HtmlNodeDetailsEndpoint from 'endpoint/html/node-details';

class HtmlNodeDetailsRoute extends HtmlRoute {
	public constructor() {
		super(HttpMethod.GET, '/:type_id/:id', HtmlNodeDetailsEndpoint);
	}
}

export default HtmlNodeDetailsRoute;
