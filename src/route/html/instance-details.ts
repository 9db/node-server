import HtmlRoute from 'route/html';
import HttpMethod from 'http/enum/method';
import HtmlInstanceDetailsEndpoint from 'endpoint/html/instance-details';

class HtmlInstanceDetailsRoute extends HtmlRoute {
	public constructor() {
		super(HttpMethod.GET, '/:type_id/:id', HtmlInstanceDetailsEndpoint);
	}
}

export default HtmlInstanceDetailsRoute;
