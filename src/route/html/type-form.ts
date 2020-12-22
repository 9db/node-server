import HtmlRoute from 'route/html';
import SystemId from 'system/enum/id';
import HttpMethod from 'http/enum/method';
import HtmlTypeFormEndpoint from 'endpoint/html/type-form';

class HtmlTypeFormRoute extends HtmlRoute {
	public constructor() {
		super(
			HttpMethod.GET,
			`/${SystemId.GENERIC_TYPE}/new`,
			HtmlTypeFormEndpoint
		);
	}
}

export default HtmlTypeFormRoute;
