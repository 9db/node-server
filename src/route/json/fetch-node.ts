import Adapter from 'interface/adapter';
import JsonRoute from 'route/json';
import HttpMethod from 'http/enum/method';
import JsonFetchNodeEndpoint from 'endpoint/json/fetch-node';

class JsonFetchNodeRoute extends JsonRoute {
	public constructor(adapter: Adapter) {
		super(
			HttpMethod.GET,
			'/:namespace_key/:type_key/:key',
			JsonFetchNodeEndpoint,
			adapter
		);
	}
}

export default JsonFetchNodeRoute;
