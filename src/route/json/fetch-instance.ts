import JsonRoute from 'route/json';
import HttpMethod from 'http/enum/method';
import JsonFetchInstanceEndpoint from 'endpoint/json/fetch-instance';

class JsonFetchInstanceRoute extends JsonRoute {
	public constructor() {
		super(HttpMethod.GET, '/:type_id/:id', JsonFetchInstanceEndpoint);
	}
}

export default JsonFetchInstanceRoute;
