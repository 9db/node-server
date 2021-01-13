import HtmlRoute from 'route/html';
import HttpMethod from 'http/enum/method';
import HtmlUpdateInstanceEndpoint from 'endpoint/html/update-instance';

class HtmlUpdateInstanceRoute extends HtmlRoute {
	public constructor() {
		super(
			HttpMethod.PATCH,
			'/:type_id/:instance_id',
			HtmlUpdateInstanceEndpoint
		);
	}
}

export default HtmlUpdateInstanceRoute;
