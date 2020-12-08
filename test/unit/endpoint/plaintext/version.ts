import HTTP from 'http';

import HttpHeader from 'http/enum/header';
import StatusCode from 'http/enum/status-code';
import ContentType from 'http/enum/content-type';
import closeServer from 'http/utility/close-server';
import MemoryAdapter from 'adapter/memory';
import fetchPlaintext from 'http/utility/fetch-plaintext';
import PlaintextVersionRoute from 'route/plaintext/version';
import PlaintextVersionEndpoint from 'endpoint/plaintext/version';

describe('PlaintextVersionEndpoint', () => {
	describe('process()', () => {
		const port = 4482;

		let server!: HTTP.Server;

		beforeEach(() => {
			server = HTTP.createServer((request, response) => {
				const route = new PlaintextVersionRoute();

				const endpoint = new PlaintextVersionEndpoint(
					request,
					response,
					route,
					new MemoryAdapter()
				);

				endpoint.serve();
			});

			server.listen(port);
		});

		afterEach((done) => {
			closeServer(server).then(done);
		});

		it('returns expected response data', async () => {
			const result = await fetchPlaintext(`http://localhost:${port}`);
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const manifest = require('../../../../../package.json');

			expect(result.body).toStrictEqual(manifest.version);
			expect(result.status_code).toStrictEqual(StatusCode.SUCCESS);

			expect(result.headers).toMatchObject({
				[HttpHeader.CONTENT_TYPE]: ContentType.TEXT,
			});
		});
	});
});
