import StatusCode from 'http/enum/status-code';
import NotFoundError from 'http/error/not-found';

describe('NotFoundError', () => {
	it('assigns the expected message', () => {
		const error = new NotFoundError();

		expect(error.message).toStrictEqual('File not found');
	});

	it('assigns the expected status code', () => {
		const error = new NotFoundError();

		expect(error.status_code).toStrictEqual(StatusCode.FILE_NOT_FOUND);
	});
});
