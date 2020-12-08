import HTTP from 'http';

import HttpHeader from 'http/enum/header';
import HttpMethod from 'http/enum/method';
import StatusCode from 'http/enum/status-code';
import ContentType from 'http/enum/content-type';
import closeServer from 'http/utility/close-server';
import MemoryAdapter from 'adapter/memory';
import PlaintextRoute from 'route/plaintext';
import fetchPlaintext from 'http/utility/fetch-plaintext';
import PlaintextEndpoint from 'endpoint/plaintext';

describe('PlaintextEndpoint', () => {
	describe('process()', () => {
		class MockEndpoint extends PlaintextEndpoint {
			protected async process(): Promise<string> {
				return Promise.resolve('Speak friend and enter');
			}
		}

		const adapter = new MemoryAdapter();

		const route = new PlaintextRoute(
			HttpMethod.GET,
			'/wizards',
			MockEndpoint,
			adapter
		);

		it('returns expected response data', async () => {
			const server = HTTP.createServer((request, response) => {
				const endpoint = new MockEndpoint(request, response, route, adapter);

				endpoint.serve();
			});

			server.listen(4428);

			const result = await fetchPlaintext('http://localhost:4428/wizards');

			expect(result.body).toStrictEqual('Speak friend and enter');
			expect(result.status_code).toStrictEqual(StatusCode.SUCCESS);

			expect(result.headers).toMatchObject({
				[HttpHeader.CONTENT_TYPE]: ContentType.TEXT,
			});

			await closeServer(server);
		});
	});

	describe('serializeError()', () => {
		class MockEndpoint extends PlaintextEndpoint {
			protected static url = '/wizards';
			protected static method = HttpMethod.GET;

			protected async process(): Promise<undefined> {
				throw new Error('A strange thing has happened');
			}
		}

		const adapter = new MemoryAdapter();

		const route = new PlaintextRoute(
			HttpMethod.GET,
			'/wizards',
			MockEndpoint,
			adapter
		);

		it('returns expected plaintext error', async () => {
			const server = HTTP.createServer((request, response) => {
				const endpoint = new MockEndpoint(request, response, route, adapter);

				endpoint.serve();
			});

			server.listen(4428);

			const result = await fetchPlaintext('http://localhost:4428/wizards');

			expect(result.body).toStrictEqual('A strange thing has happened');
			expect(result.status_code).toStrictEqual(StatusCode.SERVER_ERROR);

			await closeServer(server);
		});
	});
});
