import HTTP from 'http';

import HttpMethod from 'http/enum/method';
import ContentType from 'http/enum/content-type';
import RouteInterface from 'interface/route';
import EndpointConstructor from 'interface/endpoint-constructor';
import getAcceptedContentTypes from 'http/utility/get-accepted-content-types';

class Route implements RouteInterface {
	private content_type: ContentType;
	private method: HttpMethod;
	private url: string;
	private endpoint_constructor: EndpointConstructor;

	public constructor(
		content_type: ContentType,
		method: HttpMethod,
		url: string,
		endpoint_constructor: EndpointConstructor
	) {
		this.content_type = content_type;
		this.method = method;
		this.url = url;
		this.endpoint_constructor = endpoint_constructor;
	}

	public accepts(request: HTTP.IncomingMessage): boolean {
		if (this.url !== request.url) {
			return false;
		}

		if (this.method !== request.method) {
			return false;
		}

		return this.matchesContentType(request);
	}

	public getContentType(): ContentType {
		return this.content_type;
	}

	public serve(
		request: HTTP.IncomingMessage,
		response: HTTP.ServerResponse
	): void {
		const Constructor = this.getEndpointConstructor();
		const endpoint = new Constructor(request, response, this);

		endpoint.serve();
	}

	public getUrlParameter(url: string, parameter: string): string | undefined {
		return 'foo';
	}

	protected matchesContentType(request: HTTP.IncomingMessage): boolean {
		const content_types = getAcceptedContentTypes(request);

		return content_types.includes(this.content_type);
	}

	private getEndpointConstructor(): EndpointConstructor {
		return this.endpoint_constructor;
	}
}

export default Route;
