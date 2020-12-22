import JsonRoute from 'route/json';
import HttpMethod from 'http/enum/method';
import JsonFetchNodeEndpoint from 'endpoint/json/fetch-node';

class JsonFetchNodeRoute extends JsonRoute {
	public constructor() {
		super(
			HttpMethod.GET,
			'/:type_key/:key',
			JsonFetchNodeEndpoint
		);
	}
}

export default JsonFetchNodeRoute;
