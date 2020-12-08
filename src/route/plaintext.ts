import Route from 'route';
import HttpMethod from 'http/enum/method';
import ContentType from 'http/enum/content-type';
import EndpointConstructor from 'interface/endpoint-constructor';

class PlaintextRoute extends Route {
	public constructor(
		method: HttpMethod,
		url: string,
		endpoint_constructor: EndpointConstructor
	) {
		super(ContentType.TEXT, method, url, endpoint_constructor);
	}
}

export default PlaintextRoute;
