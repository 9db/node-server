import HttpError from 'http/error';
import StatusCode from 'http/enum/status-code';
import PageTemplate from 'template/page';

interface Input {
	readonly error: HttpError;
}

class ErrorPageTemplate extends PageTemplate {
	private input: Input;

	public constructor(input: Input) {
		super();

		this.input = input;
	}

	protected getContentTitle(): string {
		const status_code = this.getStatusCode();
		const message = this.getErrorMessage();

		return `${status_code}: ${message}`;
	}

	protected getHeaderHtml(): string {
		return 'xxx';
	}

	protected getContentHtml(): string {
		const description = this.getErrorDescription();

		return `
			<p>
				${description}
			</p>
		`;
	}

	private getErrorDescription(): string {
		const status_code = this.getStatusCode();

		switch (status_code) {
			case StatusCode.FILE_NOT_FOUND:
				return 'The specified resource was not found on this server.';
			case StatusCode.UNAUTHORIZED:
				return 'You do not have permission to perform this request.';
			case StatusCode.BAD_REQUEST:
				return 'You tried to perform an invalid request.';
			case StatusCode.SERVER_ERROR:
			default:
				return `
					An unexpected problem occurred that prevented the request from
					completing successfully.
				`;
		}
	}

	private getErrorMessage(): string {
		const error = this.getError();

		return error.message;
	}

	private getStatusCode(): StatusCode {
		const error = this.getError();

		return error.status_code;
	}

	private getError(): HttpError {
		const input = this.getInput();

		return input.error;
	}

	private getInput(): Input {
		return this.input;
	}
}

export default ErrorPageTemplate;
