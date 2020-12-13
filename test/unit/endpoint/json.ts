import HTTP from 'http';

import postJson from 'http/utility/post-json';
import fetchJson from 'http/utility/fetch-json';
import Repository from 'repository';
import HttpHeader from 'http/enum/header';
import HttpMethod from 'http/enum/method';
import StatusCode from 'http/enum/status-code';
import JsonObject from 'http/type/json-object';
import ContentType from 'http/enum/content-type';
import closeServer from 'http/utility/close-server';
import JsonEndpoint from 'endpoint/json';
import MemoryAdapter from 'adapter/memory';

describe('JsonEndpoint', () => {
	function createRepository(): Repository {
		const hostname = 'https://9db.org';
		const adapter = new MemoryAdapter();

		return new Repository(hostname, adapter);
	}

	describe('process()', () => {
		class MockEndpoint extends JsonEndpoint<{}> {
			protected process(): Promise<JsonObject> {
				return Promise.resolve({
					name: 'gandalf',
					color: 'grey',
					horse: 'shadowfax'
				});
			}
		}

		it('returns expected response data', async () => {
			const server = HTTP.createServer((request, response) => {
				const repository = createRepository();

				const endpoint = new MockEndpoint(request, response, {}, repository);

				endpoint.serve();
			});

			server.listen(4428);

			const result = await fetchJson('http://localhost:4428/wizard');

			expect(result.body).toStrictEqual({
				name: 'gandalf',
				color: 'grey',
				horse: 'shadowfax'
			});

			expect(result.status_code).toStrictEqual(StatusCode.SUCCESS);

			expect(result.headers).toMatchObject({
				[HttpHeader.CONTENT_TYPE]: ContentType.JSON
			});

			await closeServer(server);
		});
	});

	describe('serializeError()', () => {
		class MockEndpoint extends JsonEndpoint<{}> {
			protected async process(): Promise<undefined> {
				throw new Error('A strange thing has happened');
			}
		}

		it('returns expected JSON error', async () => {
			const server = HTTP.createServer((request, response) => {
				const repository = createRepository();

				const endpoint = new MockEndpoint(request, response, {}, repository);

				endpoint.serve();
			});

			server.listen(4428);

			const result = await fetchJson('http://localhost:4428/wizard');

			expect(result.body).toStrictEqual({
				message: 'A strange thing has happened'
			});

			expect(result.status_code).toStrictEqual(StatusCode.SERVER_ERROR);

			await closeServer(server);
		});
	});

	describe('parsing body', () => {
		it('uses the JSON body parser', async () => {
			expect.assertions(1);

			class MockEndpoint extends JsonEndpoint<{}> {
				protected static url = '/wizards';
				protected static method = HttpMethod.POST;

				protected async process(): Promise<string> {
					const body = this.getRequestBody();

					expect(body).toStrictEqual({
						name: 'gandalf'
					});

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
