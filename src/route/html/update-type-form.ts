import HtmlRoute from 'route/html';
import SystemId from 'system/enum/id';
import HttpMethod from 'http/enum/method';
import HtmlTypeFormEndpoint from 'endpoint/html/type-form';

class HtmlUpdateTypeFormRoute extends HtmlRoute {
	public constructor() {
		super(
			HttpMethod.POST,
			`/${SystemId.GENERIC_TYPE}/new`,
			HtmlTypeFormEndpoint
		);
	}
}

export default HtmlUpdateTypeFormRoute;
