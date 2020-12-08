import HttpError from 'http/error';
import StatusCode from 'http/enum/status-code';

class ServerError extends HttpError {
	public constructor(message: string) {
		super(message, StatusCode.SERVER_ERROR);
	}
}

export default ServerError;
