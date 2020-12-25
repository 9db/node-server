import HtmlRoute from 'route/html';
import HttpMethod from 'http/enum/method';
import HtmlInstanceFormEndpoint from 'endpoint/html/instance-form';

class HtmlInstanceFormRoute extends HtmlRoute {
	public constructor() {
		super(
			HttpMethod.GET,
			`/:type_id/new`,
			HtmlInstanceFormEndpoint
		);
	}
}

export default HtmlInstanceFormRoute;
