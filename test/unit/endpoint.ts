import HTTP from 'http';

import Route from 'route';
import sleep from 'utility/sleep';
import HttpError from 'http/error';
import HeaderMap from 'http/type/header-map';
import HttpHeader from 'http/enum/header';
import HttpMethod from 'http/enum/method';
import StatusCode from 'http/enum/status-code';
import ContentType from 'http/enum/content-type';
import ServerError from 'http/error/server-error';
import MockEndpoint from 'test/mock/endpoint';
import NotFoundError from 'http/error/not-found';
import buildMockRequest from 'test/utility/build-mock-request';
import buildMockResponse from 'test/utility/build-mock-response';

describe('Endpoint', () => {
	describe('serve()', () => {
		describe('when process() method returns a buffer', () => {
			const result = Buffer.from('speak friend and enter');

			class ThrowawayEndpoint extends MockEndpoint {
				protected process(): Promise<Buffer> {
					return Promise.resolve(result);
				}
			}

			const route = new Route(
				ContentType.TEXT,
				HttpMethod.GET,
				'/',
				MockEndpoint
			);

			it('sets expected status and headers on response', async () => {
				const request = buildMockRequest('/', HttpMethod.GET, ContentType.TEXT);
				const response = buildMockResponse();
				const write_head_spy = jest.spyOn(response, 'writeHead');
				const endpoint = new ThrowawayEndpoint(request, response, route);

				endpoint.serve();

				await sleep(10);

				expect(write_head_spy).toHaveBeenCalledWith(StatusCode.SUCCESS, {
					[HttpHeader.CONTENT_TYPE]: ContentType.TEXT,
				});
			});

			it('sends expected data to response', async () => {
				const request = buildMockRequest('/', HttpMethod.GET, ContentType.TEXT);
				const response = buildMockResponse();
				const end_spy = jest.spyOn(response, 'end');
				const endpoint = new ThrowawayEndpoint(request, response, route);

				endpoint.serve();

				await sleep(10);

				expect(end_spy).toHaveBeenCalledWith(result);
			});
		});

		describe('when process() method returns a string', () => {
			const result = 'speak friend and enter';

			class ThrowawayEndpoint extends MockEndpoint {
				protected process(): Promise<string> {
					return Promise.resolve(result);
				}
			}

			const route = new Route(
				ContentType.TEXT,
				HttpMethod.GET,
				'/',
				MockEndpoint
			);

			it('sets expected status and headers on response', async () => {
				const request = buildMockRequest('/', HttpMethod.GET, ContentType.TEXT);
				const response = buildMockResponse();
				const write_head_spy = jest.spyOn(response, 'writeHead');
				const endpoint = new ThrowawayEndpoint(request, response, route);

				endpoint.serve();

				await sleep(10);

				expect(write_head_spy).toHaveBeenCalledWith(StatusCode.SUCCESS, {
					[HttpHeader.CONTENT_TYPE]: ContentType.TEXT,
				});
			});

			it('sends expected data to response', async () => {
				const request = buildMockRequest('/', HttpMethod.GET, ContentType.TEXT);
				const response = buildMockResponse();
				const end_spy = jest.spyOn(response, 'end');
				const endpoint = new ThrowawayEndpoint(request, response, route);
				const expected_buffer = Buffer.from(result);

				endpoint.serve();

				await sleep(10);

				expect(end_spy).toHaveBeenCalledWith(expected_buffer);
			});
		});

		describe('when process() method returns undefined', () => {
			class ThrowawayEndpoint extends MockEndpoint {
				protected process(): Promise<void> {
					return Promise.resolve();
				}
			}

			const route = new Route(
				ContentType.TEXT,
				HttpMethod.GET,
				'/',
				MockEndpoint
			);

			it('does not set status or headers on response', async () => {
				const request = buildMockRequest('/', HttpMethod.GET, ContentType.TEXT);
				const response = buildMockResponse();
				const write_head_spy = jest.spyOn(response, 'writeHead');
				const endpoint = new ThrowawayEndpoint(request, response, route);

				endpoint.serve();

				await sleep(10);

				expect(write_head_spy).not.toHaveBeenCalled();
			});

			it('does not send any data to response', async () => {
				const request = buildMockRequest('/', HttpMethod.GET, ContentType.TEXT);
				const response = buildMockResponse();
				const end_spy = jest.spyOn(response, 'end');
				const endpoint = new ThrowawayEndpoint(request, response, route);

				endpoint.serve();

				await sleep(10);

				expect(end_spy).not.toHaveBeenCalled();
			});
		});

		describe('when process() method raises an exception', () => {
			it('forwards error to serializeError()', async () => {
				expect.assertions(1);

				const expected_error = new NotFoundError();

				class ThrowawayEndpoint extends MockEndpoint {
					protected process(): Promise<void> {
						return Promise.reject(expected_error);
					}

					protected serializeError(error: HttpError): string {
						expect(error).toStrictEqual(expected_error);

						return error.message;
					}
				}

				const route = new Route(
					ContentType.TEXT,
					HttpMethod.GET,
					'/',
					MockEndpoint
				);

				const request = buildMockRequest('/', HttpMethod.GET, ContentType.TEXT);
				const response = buildMockResponse();
				const endpoint = new ThrowawayEndpoint(request, response, route);

				endpoint.serve();

				await sleep(10);
			});

			describe('when process() returns a non-HTTP error', () => {
				it('converts it to a generic HTTP error before passing to serializeError()', async () => {
					expect.assertions(2);

					class ThrowawayEndpoint extends MockEndpoint {
						protected process(): Promise<void> {
							const error = new Error('A weird thing happened');

							return Promise.reject(error);
						}

						protected serializeError(error: HttpError): string {
							expect(error).toBeInstanceOf(ServerError);
							expect(error.message).toStrictEqual('A weird thing happened');

							return error.message;
						}
					}

					const route = new Route(
						ContentType.TEXT,
						HttpMethod.GET,
						'/',
						MockEndpoint
					);

					const request = buildMockRequest(
						'/',
						HttpMethod.GET,
						ContentType.TEXT
					);

					const response = buildMockResponse();
					const endpoint = new ThrowawayEndpoint(request, response, route);

					endpoint.serve();

					await sleep(10);
				});
			});
		});
	});

	describe('getRequest()', () => {
		it('returns request', () => {
			class ThrowawayEndpoint extends MockEndpoint {
				public privilegedGetRequest(): HTTP.IncomingMessage {
					return this.getRequest();
				}
			}

			const route = new Route(
				ContentType.JSON,
				HttpMethod.GET,
				'/x',
				MockEndpoint
			);

			const request = buildMockRequest('/x', HttpMethod.GET, ContentType.JSON);
			const response = buildMockResponse();
			const endpoint = new ThrowawayEndpoint(request, response, route);
			const actual_request = endpoint.privilegedGetRequest();

			expect(actual_request).toStrictEqual(request);
		});
	});

	describe('getResponse()', () => {
		it('returns response', () => {
			class ThrowawayEndpoint extends MockEndpoint {
				public privilegedGetResponse(): HTTP.ServerResponse {
					return this.getResponse();
				}
			}

			const route = new Route(
				ContentType.JSON,
				HttpMethod.GET,
				'/x',
				MockEndpoint
			);

			const request = buildMockRequest('/x', HttpMethod.GET, ContentType.JSON);
			const response = buildMockResponse();
			const endpoint = new ThrowawayEndpoint(request, response, route);
			const actual_response = endpoint.privilegedGetResponse();

			expect(actual_response).toStrictEqual(response);
		});
	});

	describe('getResponseHeaders()', () => {
		it('returns expected response headers', () => {
			class ThrowawayEndpoint extends MockEndpoint {
				public privilegedGetResponseHeaders(): HeaderMap {
					return this.getResponseHeaders();
				}
			}

			const route = new Route(
				ContentType.JSON,
				HttpMethod.GET,
				'/x',
				MockEndpoint
			);

			const request = buildMockRequest('/x', HttpMethod.GET, ContentType.JSON);
			const response = buildMockResponse();
			const endpoint = new ThrowawayEndpoint(request, response, route);
			const headers = endpoint.privilegedGetResponseHeaders();

			expect(headers).toStrictEqual({
				[HttpHeader.CONTENT_TYPE]: ContentType.JSON,
			});
		});
	});

	describe('getUrlParameter()', () => {
		it('delegates to the supplied route', () => {
			class ThrowawayEndpoint extends MockEndpoint {
				public privilegedGetUrlParameter(
					parameter: string
				): string | undefined {
					return this.getUrlParameter(parameter);
				}
			}

			const route = new Route(
				ContentType.JSON,
				HttpMethod.GET,
				'/:wizard',
				MockEndpoint
			);

			const request = buildMockRequest(
				'/gandalf',
				HttpMethod.GET,
				ContentType.JSON
			);

			const response = buildMockResponse();
			const endpoint = new ThrowawayEndpoint(request, response, route);
			const parameter = endpoint.privilegedGetUrlParameter('wizard');

			expect(parameter).toStrictEqual('gandalf');
		});
	});
});
