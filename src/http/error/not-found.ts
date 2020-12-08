import HttpError from 'http/error';
import StatusCode from 'http/enum/status-code';

class NotFoundError extends HttpError {
	public constructor() {
		super('File not found', StatusCode.FILE_NOT_FOUND);
	}
}

export default NotFoundError;
