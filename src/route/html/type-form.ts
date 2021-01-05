import HtmlRoute from 'route/html';
import HttpMethod from 'http/enum/method';
import HtmlTypeFormEndpoint from 'endpoint/html/type-form';

class HtmlTypeFormRoute extends HtmlRoute {
	public constructor() {
		super(
			HttpMethod.GET,
			`/create-type`,
			HtmlTypeFormEndpoint
		);
	}
}

export default HtmlTypeFormRoute;
