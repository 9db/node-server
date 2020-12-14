import HtmlRoute from 'route/html';
import HttpMethod from 'http/enum/method';
import HtmlNodeDetailsEndpoint from 'endpoint/html/node-details';

class HtmlNodeDetailsRoute extends HtmlRoute {
	public constructor() {
		super(
			HttpMethod.GET,
			'/:namespace_key/:type_key/:key',
			HtmlNodeDetailsEndpoint
		);
	}
}

export default HtmlNodeDetailsRoute;
