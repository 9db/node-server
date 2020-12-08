import HttpMethod from 'http/enum/method';
import NotFoundError from 'http/error/not-found';
import PlaintextEndpoint from 'endpoint/plaintext';

class NotFoundPlaintextEndpoint extends PlaintextEndpoint {
	protected static url = '/404';
	protected static method = HttpMethod.GET;

	protected async process(): Promise<undefined> {
		throw new NotFoundError();
	}
}

export default NotFoundPlaintextEndpoint;
