import JsonEndpoint from 'endpoint/json';
import NotFoundError from 'http/error/not-found';

class JsonNotFoundEndpoint extends JsonEndpoint<Record<string, never>> {
	protected async process(): Promise<undefined> {
		throw new NotFoundError();
	}
}

export default JsonNotFoundEndpoint;
