import Endpoint from 'endpoint';
import HttpError from 'http/error';

abstract class PlaintextEndpoint extends Endpoint {
	protected serializeError(error: HttpError): string {
		return error.message;
	}
}

export default PlaintextEndpoint;
