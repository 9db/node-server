import HttpError from 'http/error';
import StatusCode from 'http/enum/status-code';

class BadRequestError extends HttpError {
	public constructor(message?: string) {
		super(message || 'Invalid request', StatusCode.BAD_REQUEST);
	}
}

export default BadRequestError;
