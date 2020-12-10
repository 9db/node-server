import HTTP from 'http';

import postJson from 'http/utility/post-json';
import closeServer from 'http/utility/close-server';
import StringBodyParser from 'server/body-parser/string';

describe('StringBodyParser', () => {
	describe('parse()', () => {
		it('returns expected value', async () => {
			expect.assertions(1);

			const port = 4428;

			const server = HTTP.createServer((request, response) => {
				const parser = new StringBodyParser(request);

				parser.parse().then((result) => {
					expect(result).toStrictEqual('{"password":"mellon"}');

					response.end('{}');
				});
			});

			server.listen(port);

			await postJson(`http://localhost:${port}`, {
				password: 'mellon'
			});

			closeServer(server);
		});
	});
});
