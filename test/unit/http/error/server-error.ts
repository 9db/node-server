import StatusCode from 'http/enum/status-code';
import ServerError from 'http/error/server-error';

describe('ServerError', () => {
	it('assigns the expected message', () => {
		const error = new ServerError('Something went wrong');

		expect(error.message).toStrictEqual('Something went wrong');
	});

	it('assigns the expected status code', () => {
		const error = new ServerError('Something went wrong');

		expect(error.status_code).toStrictEqual(StatusCode.SERVER_ERROR);
	});
});
