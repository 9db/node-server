import HttpError from 'http/error';
import StatusCode from 'http/enum/status-code';

class MockError extends HttpError {}

describe('HttpError', () => {
	it('passes the supplied message to the Error constructor', () => {
		const error = new MockError('Permission denied', StatusCode.UNAUTHORIZED);

		expect(error.message).toStrictEqual('Permission denied');
	});

	it('assigns the supplied status code', () => {
		const error = new MockError('Permission denied', StatusCode.UNAUTHORIZED);

		expect(error.status_code).toStrictEqual(StatusCode.UNAUTHORIZED);
	});
});
