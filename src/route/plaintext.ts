import Route from 'route';
import Adapter from 'interface/adapter';
import HttpMethod from 'http/enum/method';
import ContentType from 'http/enum/content-type';
import EndpointConstructor from 'interface/endpoint-constructor';

class PlaintextRoute extends Route {
	public constructor(
		method: HttpMethod,
		url: string,
		endpoint_constructor: EndpointConstructor,
		adapter: Adapter
	) {
		super(ContentType.TEXT, method, url, endpoint_constructor, adapter);
	}
}

export default PlaintextRoute;
