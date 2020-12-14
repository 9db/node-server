import HtmlRoute from 'route/html';
import SystemKey from 'system/enum/key';
import HttpMethod from 'http/enum/method';
import HtmlTypeFormEndpoint from 'endpoint/html/type-form';

class HtmlTypeFormRoute extends HtmlRoute {
	public constructor() {
		super(
			HttpMethod.GET,
			`/:namespace_key/${SystemKey.GENERIC_TYPE}/new`,
			HtmlTypeFormEndpoint
		);
	}
}

export default HtmlTypeFormRoute;
