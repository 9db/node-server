import HTTP from 'http';

import HttpHeader from 'http/enum/header';
import StatusCode from 'http/enum/status-code';
import ContentType from 'http/enum/content-type';
import fetchBuffer from 'http/utility/fetch-buffer';
import closeServer from 'http/utility/close-server';
import SystemErrorCode from 'enum/system-error-code';

describe('fetchBuffer', () => {
	it('sends the expected headers', async () => {
		const server = HTTP.createServer((request, response) => {
			expect(request.headers).toEqual({
				[HttpHeader.ACCEPT]: ContentType.JSON,
				[HttpHeader.CONNECTION]: 'close',
				[HttpHeader.HOST]: 'localhost:4428',
			});

			response.writeHead(StatusCode.SUCCESS);
			response.end('');
		});

		server.listen(4428);

		await fetchBuffer('http://localhost:4428', ContentType.JSON);
		await closeServer(server);
	});

	describe('when request succeeds', () => {
		it('returns the expected data', async () => {
			const server = HTTP.createServer((_request, response) => {
				response.writeHead(StatusCode.SUCCESS, {
					[HttpHeader.CONTENT_TYPE]: ContentType.TEXT,
				});

				response.end('speak friend and enter');
			});

			server.listen(4428);

			const result = await fetchBuffer(
				'http://localhost:4428',
				ContentType.JSON
			);

			const expected_buffer = Buffer.from('speak friend and enter');

			expect(result.body).toStrictEqual(expected_buffer);
			expect(result.status_code).toStrictEqual(StatusCode.SUCCESS);

			expect(result.headers).toMatchObject({
				[HttpHeader.CONTENT_TYPE]: ContentType.TEXT,
			});

			await closeServer(server);
		});
	});

	describe('when request fails', () => {
		it('raises an exception', async () => {
			expect.assertions(2);

			const server = HTTP.createServer((request, _response) => {
				request.destroy();
			});

			server.listen(4428);

			try {
				await fetchBuffer('http://localhost:4428', ContentType.JSON);
			} catch (error) {
				expect(error.code).toStrictEqual(SystemErrorCode.ECONNRESET);
				expect(error.message).toStrictEqual('socket hang up');
			}

			await closeServer(server);
		});
	});
});
