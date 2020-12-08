import Endpoint from 'endpoint';
import HttpError from 'http/error';
import ContentType from 'http/enum/content-type';

abstract class PlaintextEndpoint extends Endpoint {
	protected static content_type = ContentType.TEXT;

	protected serveError(error: HttpError): void {
		const response = this.getResponse();

		response.writeHead(error.status_code, this.getResponseHeaders());
		response.end(error.message);
	}
}

export default PlaintextEndpoint;
