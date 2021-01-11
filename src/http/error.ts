import StatusCode from 'http/enum/status-code';

abstract class HttpError extends Error {
	public status_code: StatusCode;

	public constructor(message: string, status_code: StatusCode) {
		const trimmed_message = message.trim().replace(/\s+/g, ' ');

		super(trimmed_message);

		this.status_code = status_code;
	}
}

export default HttpError;
