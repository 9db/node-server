import HTTP from 'http';

import Repository from 'repository';
import HttpMethod from 'http/enum/method';
import PathParser from 'route/utility/path-parser';
import ContentType from 'http/enum/content-type';
import UrlParameters from 'http/type/url-parameters';
import EndpointConstructor from 'interface/endpoint-constructor';
import getAcceptedContentTypes from 'http/utility/get-accepted-content-types';

class Route {
	private content_type: ContentType;
	private method: HttpMethod;
	private endpoint_constructor: EndpointConstructor;
	private parameter_keys: string[];
	private regex: RegExp;

	public constructor(
		content_type: ContentType,
		method: HttpMethod,
		path: string,
		endpoint_constructor: EndpointConstructor
	) {
		this.content_type = content_type;
		this.method = method;
		this.endpoint_constructor = endpoint_constructor;

		const parser = new PathParser(path);
		const parsed_path = parser.parse();

		this.regex = parsed_path.regex;
		this.parameter_keys = parsed_path.parameter_keys;
	}

	public accepts(request: HTTP.IncomingMessage): boolean {
		if (request.url === undefined) {
			return false;
		}

		if (this.regex.test(request.url) === false) {
			return false;
		}

		if (this.method !== request.method) {
			return false;
		}

		return this.matchesContentType(request);
	}

	public serve(
		request: HTTP.IncomingMessage,
		response: HTTP.ServerResponse,
		repository: Repository
	): void {
		const Constructor = this.getEndpointConstructor();
		const url_parameters = this.getUrlParametersForRequest(request);

		const endpoint = new Constructor(
			request,
			response,
			url_parameters,
			repository
		);

		endpoint.serve();
	}

	protected matchesContentType(request: HTTP.IncomingMessage): boolean {
		const content_types = getAcceptedContentTypes(request);

		return content_types.includes(this.content_type);
	}

	private getUrlParametersForRequest(
		request: HTTP.IncomingMessage
	): UrlParameters {
		const url = request.url || '/';
		const regex = this.getRegex();
		const match = url.match(regex);
		const result: UrlParameters = {};

		if (match === null) {
			return result;
		}

		const parameter_keys = this.getParameterKeys();

		parameter_keys.forEach((parameter_key, index) => {
			const parameter_value = match[index + 1];

			result[parameter_key] = parameter_value;
		});

		return result;
	}

	private getParameterKeys(): string[] {
		return this.parameter_keys;
	}

	private getRegex(): RegExp {
		return this.regex;
	}

	private getEndpointConstructor(): EndpointConstructor {
		return this.endpoint_constructor;
	}
}

export default Route;
