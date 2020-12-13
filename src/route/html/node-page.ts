import HtmlRoute from 'route/html';
import HttpMethod from 'http/enum/method';
import HtmlNodePageEndpoint from 'endpoint/html/node-page';

class HtmlNodePageRoute extends HtmlRoute {
	public constructor() {
		super(
			HttpMethod.GET,
			'/:namespace_key/:type_key/:key',
			HtmlNodePageEndpoint
		);
	}
}

export default HtmlNodePageRoute;
