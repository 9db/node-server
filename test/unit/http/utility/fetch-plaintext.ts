import HTTP from 'http';

import HttpHeader from 'http/enum/header';
import StatusCode from 'http/enum/status-code';
import ContentType from 'http/enum/content-type';
import closeServer from 'http/utility/close-server';
import fetchPlaintext from 'http/utility/fetch-plaintext';

describe('fetchBuffer', () => {
	it('sends the expected headers', async () => {
		const server = HTTP.createServer((request, response) => {
			expect(request.headers).toEqual({
				[HttpHeader.ACCEPT]: ContentType.TEXT,
				[HttpHeader.CONNECTION]: 'close',
				[HttpHeader.HOST]: 'localhost:4428',
			});

			response.writeHead(StatusCode.SUCCESS);
			response.end('');
		});

		server.listen(4428);

		await fetchPlaintext('http://localhost:4428');
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

			const result = await fetchPlaintext('http://localhost:4428');

			expect(result.body).toStrictEqual('speak friend and enter');
			expect(result.status_code).toStrictEqual(StatusCode.SUCCESS);

			expect(result.headers).toMatchObject({
				[HttpHeader.CONTENT_TYPE]: ContentType.TEXT,
			});

			await closeServer(server);
		});
	});
});
