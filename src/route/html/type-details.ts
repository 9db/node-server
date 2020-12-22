import HtmlRoute from 'route/html';
import HttpMethod from 'http/enum/method';
import HtmlTypeDetailsEndpoint from 'endpoint/html/type-details';

class HtmlTypeDetailsRoute extends HtmlRoute {
	public constructor() {
		super(HttpMethod.GET, '/:type_id', HtmlTypeDetailsEndpoint);
	}
}

export default HtmlTypeDetailsRoute;
