import StatusCode from 'http/enum/status-code';

abstract class HttpError extends Error {
	public status_code: StatusCode;

	public constructor(message: string, status_code: StatusCode) {
		super(message);

		this.status_code = status_code;
	}
}

export default HttpError;
