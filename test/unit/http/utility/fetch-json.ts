import HTTP from 'http';

import fetchJson from 'http/utility/fetch-json';
import HttpHeader from 'http/enum/header';
import StatusCode from 'http/enum/status-code';
import ContentType from 'http/enum/content-type';
import closeServer from 'http/utility/close-server';

describe('fetchJson', () => {
	it('sends the expected headers', async () => {
		const server = HTTP.createServer((request, response) => {
			expect(request.headers).toEqual({
				[HttpHeader.ACCEPT]: ContentType.JSON,
				[HttpHeader.CONNECTION]: 'close',
				[HttpHeader.HOST]: 'localhost:4428',
			});

			response.writeHead(StatusCode.SUCCESS, {
				[HttpHeader.CONTENT_TYPE]: ContentType.JSON,
			});

			response.end('{}');
		});

		server.listen(4428);

		await fetchJson('http://localhost:4428');
		await closeServer(server);
	});

	describe('when request succeeds', () => {
		it('returns the expected data', async () => {
			const expected_body = {
				name: 'gandalf',
				color: 'grey',
				horse: 'shadowfax',
			};

			const server = HTTP.createServer((_request, response) => {
				response.writeHead(StatusCode.SUCCESS, {
					[HttpHeader.CONTENT_TYPE]: ContentType.JSON,
				});

				const serialized_body = JSON.stringify(expected_body);

				response.end(serialized_body);
			});

			server.listen(4428);

			const result = await fetchJson('http://localhost:4428');

			expect(result.body).toStrictEqual(expected_body);
			expect(result.status_code).toStrictEqual(StatusCode.SUCCESS);

			expect(result.headers).toMatchObject({
				[HttpHeader.CONTENT_TYPE]: ContentType.JSON,
			});

			await closeServer(server);
		});
	});
});
