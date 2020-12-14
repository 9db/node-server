import Endpoint from 'endpoint';
import HttpError from 'http/error';

abstract class StaticEndpoint extends Endpoint<{}, Buffer> {
	protected serializeError(error: HttpError): Buffer {
		return Buffer.from(error.message);
	}
}

export default StaticEndpoint;
