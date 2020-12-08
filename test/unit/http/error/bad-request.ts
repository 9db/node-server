import StatusCode from 'http/enum/status-code';
import BadRequestError from 'http/error/bad-request';

describe('BadRequestError', () => {
	it('assigns the expected message', () => {
		const error = new BadRequestError();

		expect(error.message).toStrictEqual('Invalid request');
	});

	it('assigns the expected status code', () => {
		const error = new BadRequestError();

		expect(error.status_code).toStrictEqual(StatusCode.BAD_REQUEST);
	});
});
