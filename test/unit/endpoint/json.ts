import HTTP from 'http';

import JsonRoute from 'route/json';
import fetchJson from 'http/utility/fetch-json';
import HttpHeader from 'http/enum/header';
import HttpMethod from 'http/enum/method';
import StatusCode from 'http/enum/status-code';
import JsonObject from 'http/type/json-object';
import ContentType from 'http/enum/content-type';
import closeServer from 'http/utility/close-server';
import JsonEndpoint from 'endpoint/json';

describe('JsonEndpoint', () => {
	describe('process()', () => {
		class MockEndpoint extends JsonEndpoint {
			protected process(): Promise<JsonObject> {
				return Promise.resolve({
					name: 'gandalf',
					color: 'grey',
					horse: 'shadowfax',
				});
			}
		}

		const route = new JsonRoute(HttpMethod.GET, '/wizard', MockEndpoint);

		it('returns expected response data', async () => {
			const server = HTTP.createServer((request, response) => {
				const endpoint = new MockEndpoint(request, response, route);

				endpoint.serve();
			});

			server.listen(4428);

			const result = await fetchJson('http://localhost:4428/wizard');

			expect(result.body).toStrictEqual({
				name: 'gandalf',
				color: 'grey',
				horse: 'shadowfax',
			});

			expect(result.status_code).toStrictEqual(StatusCode.SUCCESS);

			expect(result.headers).toMatchObject({
				[HttpHeader.CONTENT_TYPE]: ContentType.JSON,
			});

			await closeServer(server);
		});
	});

	describe('serializeError()', () => {
		class MockEndpoint extends JsonEndpoint {
			protected async process(): Promise<undefined> {
				throw new Error('A strange thing has happened');
			}
		}

		const route = new JsonRoute(HttpMethod.GET, '/wizard', MockEndpoint);

		it('returns expected JSON error', async () => {
			const server = HTTP.createServer((request, response) => {
				const endpoint = new MockEndpoint(request, response, route);

				endpoint.serve();
			});

			server.listen(4428);

			const result = await fetchJson('http://localhost:4428/wizard');

			expect(result.body).toStrictEqual({
				message: 'A strange thing has happened',
			});

			expect(result.status_code).toStrictEqual(StatusCode.SERVER_ERROR);

			await closeServer(server);
		});
	});
});
