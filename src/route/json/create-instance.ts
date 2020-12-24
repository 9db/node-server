import JsonRoute from 'route/json';
import HttpMethod from 'http/enum/method';
import JsonCreateInstanceEndpoint from 'endpoint/json/create-instance';

class JsonCreateInstanceRoute extends JsonRoute {
	public constructor() {
		super(HttpMethod.POST, '/:type_id/:id', JsonCreateInstanceEndpoint);
	}
}

export default JsonCreateInstanceRoute;
