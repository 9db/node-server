import JsonRoute from 'route/json';
import HttpMethod from 'http/enum/method';
import JsonCreateNodeEndpoint from 'endpoint/json/create-node';

class JsonCreateNodeRoute extends JsonRoute {
	public constructor() {
		super(
			HttpMethod.POST,
			'/:type_key/:key',
			JsonCreateNodeEndpoint
		);
	}
}

export default JsonCreateNodeRoute;
