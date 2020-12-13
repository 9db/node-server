import HttpError from 'http/error';
import StatusCode from 'http/enum/status-code';

class UnauthorizedError extends HttpError {
	public constructor() {
		super('Permission denied', StatusCode.UNAUTHORIZED);
	}
}

export default UnauthorizedError;
