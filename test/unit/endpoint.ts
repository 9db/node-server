import HTTP from 'http';

import sleep from 'utility/sleep';
import HttpError from 'http/error';
import HeaderMap from 'http/type/header-map';
import Repository from 'repository';
import HttpHeader from 'http/enum/header';
import HttpMethod from 'http/enum/method';
import StatusCode from 'http/enum/status-code';
import JsonObject from 'http/type/json-object';
import ContentType from 'http/enum/content-type';
import ServerError from 'http/error/server-error';
import MockEndpoint from 'test/mock/endpoint';
import MemoryAdapter from 'adapter/memory';
import NotFoundError from 'http/error/not-found';
import BadRequestError from 'http/error/bad-request';
import buildMockRequest from 'test/utility/build-mock-request';
import buildMockResponse from 'test/utility/build-mock-response';

describe('Endpoint', () => {
	function createRepository(): Repository {
		const hostname = 'https://9db.org';
		const adapter = new MemoryAdapter();

		return new Repository(hostname, adapter);
	}

	describe('serve()', () => {
		describe('when process() method returns a buffer', () => {
			const result = Buffer.from('speak friend and enter');

			class ThrowawayEndpoint extends MockEndpoint<JsonObject, Buffer> {
				protected process(): Promise<Buffer> {
					return Promise.resolve(result);
				}

				protected getResponseContentType(): ContentType {
					return ContentType.TEXT;
				}
			}

			it('sets expected status and headers on response', async () => {
				const request = buildMockRequest('/', HttpMethod.GET, ContentType.TEXT);
				const response = buildMockResponse();
				const write_head_spy = jest.spyOn(response, 'writeHead');
				const repository = createRepository();

				const endpoint = new ThrowawayEndpoint(
					request,
					response,
					{},
					repository
				);

				endpoint.serve();

				await sleep(10);

				expect(write_head_spy).toHaveBeenCalledWith(StatusCode.SUCCESS, {
					[HttpHeader.CONTENT_TYPE]: ContentType.TEXT
				});
			});

			it('sends expected data to response', async () => {
				const request = buildMockRequest('/', HttpMethod.GET, ContentType.TEXT);
				const response = buildMockResponse();
				const end_spy = jest.spyOn(response, 'end');
				const repository = createRepository();

				const endpoint = new ThrowawayEndpoint(
					request,
					response,
					{},
					repository
				);

				endpoint.serve();

				await sleep(10);

				expect(end_spy).toHaveBeenCalledWith(result);
			});
		});

		describe('when process() method returns a string', () => {
			const result = 'speak friend and enter';

			class ThrowawayEndpoint extends MockEndpoint<JsonObject, string> {
				protected process(): Promise<string> {
					return Promise.resolve(result);
				}

				protected getResponseContentType(): ContentType {
					return ContentType.TEXT;
				}
			}

			it('sets expected status and headers on response', async () => {
				const request = buildMockRequest('/', HttpMethod.GET, ContentType.TEXT);
				const response = buildMockResponse();
				const write_head_spy = jest.spyOn(response, 'writeHead');
				const repository = createRepository();

				const endpoint = new ThrowawayEndpoint(
					request,
					response,
					{},
					repository
				);

				endpoint.serve();

				await sleep(10);

				expect(write_head_spy).toHaveBeenCalledWith(StatusCode.SUCCESS, {
					[HttpHeader.CONTENT_TYPE]: ContentType.TEXT
				});
			});

			it('sends expected data to response', async () => {
				const request = buildMockRequest('/', HttpMethod.GET, ContentType.TEXT);
				const response = buildMockResponse();
				const end_spy = jest.spyOn(response, 'end');
				const expected_buffer = Buffer.from(result);
				const repository = createRepository();

				const endpoint = new ThrowawayEndpoint(
					request,
					response,
					{},
					repository
				);

				endpoint.serve();

				await sleep(10);

				expect(end_spy).toHaveBeenCalledWith(expected_buffer);
			});
		});

		describe('when process() method returns undefined', () => {
			class ThrowawayEndpoint extends MockEndpoint<JsonObject, string> {
				protected process(): Promise<void> {
					return Promise.resolve();
				}

				protected getResponseContentType(): ContentType {
					return ContentType.TEXT;
				}
			}

			it('does not set status or headers on response', async () => {
				const request = buildMockRequest('/', HttpMethod.GET, ContentType.TEXT);
				const response = buildMockResponse();
				const write_head_spy = jest.spyOn(response, 'writeHead');
				const repository = createRepository();

				const endpoint = new ThrowawayEndpoint(
					request,
					response,
					{},
					repository
				);

				endpoint.serve();

				await sleep(10);

				expect(write_head_spy).not.toHaveBeenCalled();
			});

			it('does not send any data to response', async () => {
				const request = buildMockRequest('/', HttpMethod.GET, ContentType.TEXT);
				const response = buildMockResponse();
				const end_spy = jest.spyOn(response, 'end');
				const repository = createRepository();

				const endpoint = new ThrowawayEndpoint(
					request,
					response,
					{},
					repository
				);

				endpoint.serve();

				await sleep(10);

				expect(end_spy).not.toHaveBeenCalled();
			});
		});

		describe('when process() method raises an exception', () => {
			it('forwards error to serializeError()', async () => {
				expect.assertions(1);

				const expected_error = new NotFoundError();

				class ThrowawayEndpoint extends MockEndpoint<JsonObject, string> {
					protected process(): Promise<void> {
						return Promise.reject(expected_error);
					}

					protected getResponseContentType(): ContentType {
						return ContentType.TEXT;
					}

					protected serializeError(error: HttpError): string {
						expect(error).toStrictEqual(expected_error);

						return error.message;
					}
				}

				const request = buildMockRequest('/', HttpMethod.GET, ContentType.TEXT);
				const response = buildMockResponse();
				const repository = createRepository();

				const endpoint = new ThrowawayEndpoint(
					request,
					response,
					{},
					repository
				);

				endpoint.serve();

				await sleep(10);
			});

			describe('when process() returns a non-HTTP error', () => {
				it('converts it to a generic HTTP error before passing to serializeError()', async () => {
					expect.assertions(2);

					class ThrowawayEndpoint extends MockEndpoint<JsonObject, string> {
						protected process(): Promise<void> {
							const error = new Error('A weird thing happened');

							return Promise.reject(error);
						}

						protected getResponseContentType(): ContentType {
							return ContentType.TEXT;
						}

						protected serializeError(error: HttpError): string {
							expect(error).toBeInstanceOf(ServerError);
							expect(error.message).toStrictEqual('A weird thing happened');

							return error.message;
						}
					}

					const request = buildMockRequest(
						'/',
						HttpMethod.GET,
						ContentType.TEXT
					);

					const response = buildMockResponse();
					const repository = createRepository();

					const endpoint = new ThrowawayEndpoint(
						request,
						response,
						{},
						repository
					);

					endpoint.serve();

					await sleep(10);
				});
			});
		});
	});

	describe('getRequest()', () => {
		it('returns request', () => {
			class ThrowawayEndpoint extends MockEndpoint<JsonObject, string> {
				public privilegedGetRequest(): HTTP.IncomingMessage {
					return this.getRequest();
				}

				protected getResponseContentType(): ContentType {
					return ContentType.TEXT;
				}
			}

			const request = buildMockRequest('/x', HttpMethod.GET, ContentType.JSON);
			const response = buildMockResponse();
			const repository = createRepository();

			const endpoint = new ThrowawayEndpoint(request, response, {}, repository);

			const actual_request = endpoint.privilegedGetRequest();

			expect(actual_request).toStrictEqual(request);
		});
	});

	describe('getResponse()', () => {
		it('returns response', () => {
			class ThrowawayEndpoint extends MockEndpoint<JsonObject, string> {
				public privilegedGetResponse(): HTTP.ServerResponse {
					return this.getResponse();
				}

				protected getResponseContentType(): ContentType {
					return ContentType.TEXT;
				}
			}

			const request = buildMockRequest('/x', HttpMethod.GET, ContentType.JSON);
			const response = buildMockResponse();
			const repository = createRepository();

			const endpoint = new ThrowawayEndpoint(request, response, {}, repository);

			const actual_response = endpoint.privilegedGetResponse();

			expect(actual_response).toStrictEqual(response);
		});
	});

	describe('getResponseHeaders()', () => {
		it('returns expected response headers', () => {
			class ThrowawayEndpoint extends MockEndpoint<JsonObject, JsonObject> {
				public privilegedGetResponseHeaders(): HeaderMap {
					return this.getResponseHeaders();
				}

				protected getResponseContentType(): ContentType {
					return ContentType.JSON;
				}
			}

			const request = buildMockRequest('/x', HttpMethod.GET, ContentType.JSON);
			const response = buildMockResponse();
			const repository = createRepository();

			const endpoint = new ThrowawayEndpoint(request, response, {}, repository);

			const headers = endpoint.privilegedGetResponseHeaders();

			expect(headers).toStrictEqual({
				[HttpHeader.CONTENT_TYPE]: ContentType.JSON
			});
		});
	});

	describe('getUrlParameter()', () => {
		class ThrowawayEndpoint extends MockEndpoint<JsonObject, string> {
			public privilegedGetUrlParameter(parameter: string): string | undefined {
				return this.getUrlParameter(parameter);
			}

			protected getResponseContentType(): ContentType {
				return ContentType.TEXT;
			}
		}

		const request = buildMockRequest(
			'/gandalf',
			HttpMethod.GET,
			ContentType.JSON
		);

		const response = buildMockResponse();
		const repository = createRepository();

		const endpoint = new ThrowawayEndpoint(
			request,
			response,
			{
				wizard: 'gandalf'
			},
			repository
		);

		describe('when the requested parameter is present on the URL parameters', () => {
			it('returns the expected value', () => {
				const parameter = endpoint.privilegedGetUrlParameter('wizard');

				expect(parameter).toStrictEqual('gandalf');
			});
		});

		describe('when requested parameter is not present', () => {
			it('raises an exception', () => {
				expect(() => {
					endpoint.privilegedGetUrlParameter('ringwraith');
				}).toThrow(BadRequestError);
			});
		});
	});

	describe('setStatusCode()', () => {
		it('sets the status code that is sent back to the response', async () => {
			expect.assertions(1);

			class ThrowawayEndpoint extends MockEndpoint<JsonObject, string> {
				protected process(): Promise<string> {
					this.setStatusCode(StatusCode.UNAUTHORIZED);

					return Promise.resolve('Permission denied');
				}

				protected getResponseContentType(): ContentType {
					return ContentType.TEXT;
				}
			}

			const request = buildMockRequest('/', HttpMethod.GET, ContentType.TEXT);
			const response = buildMockResponse();
			const repository = createRepository();

			const endpoint = new ThrowawayEndpoint(request, response, {}, repository);

			const write_head_spy = jest.spyOn(response, 'writeHead');

			write_head_spy.mockImplementation((status_code) => {
				expect(status_code).toStrictEqual(StatusCode.UNAUTHORIZED);

				return response;
			});

			endpoint.serve();

			await sleep(10);
		});
	});

	describe('getRepository()', () => {
		it('returns supplied repository', () => {
			class ThrowawayEndpoint extends MockEndpoint<JsonObject, string> {
				public privilegedGetRepository(): Repository {
					return this.getRepository();
				}

				protected getResponseContentType(): ContentType {
					return ContentType.TEXT;
				}
			}

			const request = buildMockRequest('/', HttpMethod.GET, ContentType.TEXT);
			const response = buildMockResponse();
			const repository = createRepository();

			const endpoint = new ThrowawayEndpoint(request, response, {}, repository);

			const actual_repository = endpoint.privilegedGetRepository();

			expect(actual_repository).toStrictEqual(repository);
		});
	});

	describe('getRequestBody()', () => {
		const request = buildMockRequest('/', HttpMethod.GET, ContentType.TEXT);
		const response = buildMockResponse();
		const repository = createRepository();

		class ThrowawayEndpoint extends MockEndpoint<JsonObject, string> {
			public privilegedGetRequestBody(): JsonObject {
				return this.getRequestBody();
			}

			protected getResponseContentType(): ContentType {
				return ContentType.TEXT;
			}
		}

		describe('when the request body has already been assigned', () => {
			it('returns the request body', () => {
				const endpoint = new ThrowawayEndpoint(
					request,
					response,
					{},
					repository
				);

				Object.assign(endpoint, {
					request_body: {
						message: 'speak friend and enter'
					}
				});

				const request_body = endpoint.privilegedGetRequestBody();

				expect(request_body).toStrictEqual({
					message: 'speak friend and enter'
				});
			});
		});

		describe('when the request body has not yet been assigned', () => {
			it('raises an exception', () => {
				const endpoint = new ThrowawayEndpoint(
					request,
					response,
					{},
					repository
				);

				expect(() => {
					endpoint.privilegedGetRequestBody();
				}).toThrow(/Tried to read request body, but it was not set/);
			});
		});
	});
});
