import HtmlRoute from 'route/html';
import HttpMethod from 'http/enum/method';
import HtmlFieldDetailsEndpoint from 'endpoint/html/field-details';

class HtmlFieldDetailsRoute extends HtmlRoute {
	public constructor() {
		super(
			HttpMethod.GET,
			'/:type_id/:instance_id/:field_key',
			HtmlFieldDetailsEndpoint
		);
	}
}

export default HtmlFieldDetailsRoute;
