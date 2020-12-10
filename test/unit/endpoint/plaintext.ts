import HTTP from 'http';

import postJson from 'http/utility/post-json';
import Repository from 'repository';
import HttpHeader from 'http/enum/header';
import HttpMethod from 'http/enum/method';
import StatusCode from 'http/enum/status-code';
import ContentType from 'http/enum/content-type';
import closeServer from 'http/utility/close-server';
import MemoryAdapter from 'adapter/memory';
import fetchPlaintext from 'http/utility/fetch-plaintext';
import PlaintextEndpoint from 'endpoint/plaintext';

describe('PlaintextEndpoint', () => {
	function createRepository(): Repository {
		const hostname = 'https://9db.org';
		const adapter = new MemoryAdapter();

		return new Repository(hostname, adapter);
	}

	describe('process()', () => {
		class MockEndpoint extends PlaintextEndpoint {
			protected async process(): Promise<string> {
				return Promise.resolve('Speak friend and enter');
			}
		}

		it('returns expected response data', async () => {
			const server = HTTP.createServer((request, response) => {
				const repository = createRepository();

				const endpoint = new MockEndpoint(request, response, {}, repository);

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

		it('returns expected plaintext error', async () => {
			const port = 4428;

			const server = HTTP.createServer((request, response) => {
				const repository = createRepository();
				const endpoint = new MockEndpoint(request, response, {}, repository);

				endpoint.serve();
			});

			server.listen(port);

			const result = await fetchPlaintext(`http://localhost:${port}/wizards`);

			expect(result.body).toStrictEqual('A strange thing has happened');
			expect(result.status_code).toStrictEqual(StatusCode.SERVER_ERROR);

			await closeServer(server);
		});
	});

	describe('parsing body', () => {
		it('uses the string body parser', async () => {
			expect.assertions(1);

			class MockEndpoint extends PlaintextEndpoint {
				protected static url = '/wizards';
				protected static method = HttpMethod.POST;

				protected async process(): Promise<string> {
					const body = this.getRequestBody();

					expect(body).toStrictEqual('{"name":"gandalf"}');

					return Promise.resolve('{}');
				}
			}

			const port = 4428;

			const server = HTTP.createServer((request, response) => {
				const repository = createRepository();
				const endpoint = new MockEndpoint(request, response, {}, repository);

				endpoint.serve();
			});

			server.listen(port);

			await postJson(`http://localhost:${port}/wizards`, {
				name: 'gandalf'
			});

			await closeServer(server);
		});
	});
});
