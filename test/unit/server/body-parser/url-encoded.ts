import HTTP from 'http';

import postBuffer from 'http/utility/post-buffer';
import ContentType from 'http/enum/content-type';
import closeServer from 'http/utility/close-server';
import UrlEncodedBodyParser from 'server/body-parser/url-encoded';

describe('parse()', () => {
	describe('when given a nested object + array structure without explicit numeric indices', () => {
		const port = 4428;

		it('returns expected parsed body', async () => {
			const server = HTTP.createServer(async (request, response) => {
				const parser = new UrlEncodedBodyParser(request);
				const body = await parser.parse();

				expect(body).toStrictEqual({
					fields: [
						{
							key: 'foo',
							value: 'bar'
						}
					]
				});

				response.end('');
			});

			server.listen(port);

			const input = 'fields%5B%5D%5Bkey%5D=foo&fields%5B%5D%5Bvalue%5D=bar';
			const url = `http://localhost:${port}`;
			const data = Buffer.from(input);

			await postBuffer(url, ContentType.URL_ENCODED, data);
			await closeServer(server);
		});
	});

	describe('when given a nested object + array structure with explicit numeric indices', () => {
		const port = 4428;

		it('returns expected parsed body', async () => {
			const server = HTTP.createServer(async (request, response) => {
				const parser = new UrlEncodedBodyParser(request);
				const body = await parser.parse();

				expect(body).toMatchObject({
					fields: [
						{
							value: 'bar'
						},
						undefined,
						{
							key: 'foo'
						}
					]
				});

				response.end('');
			});

			server.listen(port);

			const input = 'fields%5B2%5D%5Bkey%5D=foo&fields%5B0%5D%5Bvalue%5D=bar';
			const url = `http://localhost:${port}`;
			const data = Buffer.from(input);

			await postBuffer(url, ContentType.URL_ENCODED, data);
			await closeServer(server);
		});
	});
});
