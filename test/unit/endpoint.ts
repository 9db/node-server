import HTTP from 'http';

import sleep from 'utility/sleep';
import Endpoint from 'endpoint';
import HttpError from 'http/error';
import HeaderMap from 'http/type/header-map';
import HttpHeader from 'http/enum/header';
import HttpMethod from 'http/enum/method';
import StatusCode from 'http/enum/status-code';
import ContentType from 'http/enum/content-type';
import ServerError from 'http/error/server-error';
import NotFoundError from 'http/error/not-found';
import buildMockRequest from 'test/utility/build-mock-request';
import buildMockResponse from 'test/utility/build-mock-response';

describe('Endpoint', () => {
	describe('accepts()', () => {
		class MockEndpoint extends Endpoint {
			protected static url = '/foo';
			protected static method = HttpMethod.GET;
			protected static content_type = ContentType.TEXT;

			protected process(): Promise<undefined> {
				throw new Error('Not implemented');
			}

			protected serveError(_error: HttpError): void {
				throw new Error('Not implemented');
			}
		}

		describe('when given a request whose URL does not match', () => {
			const request = buildMockRequest(
				'/bar',
				HttpMethod.GET,
				ContentType.TEXT
			);

			it('returns false', () => {
				expect(MockEndpoint.accepts(request)).toBe(false);
			});
		});

		describe('when given a request whose method does not match', () => {
			const request = buildMockRequest(
				'/foo',
				HttpMethod.POST,
				ContentType.TEXT
			);

			it('returns false', () => {
				expect(MockEndpoint.accepts(request)).toBe(false);
			});
		});

		describe('when given a request whose content type does not match', () => {
			const request = buildMockRequest(
				'/foo',
				HttpMethod.GET,
				ContentType.JSON
			);

			it('returns false', () => {
				expect(MockEndpoint.accepts(request)).toBe(false);
			});
		});

		describe('when given a matching request', () => {
			const request = buildMockRequest(
				'/foo',
				HttpMethod.GET,
				ContentType.TEXT
			);

			it('returns true', () => {
				expect(MockEndpoint.accepts(request)).toBe(true);
			});
		});
	});

	describe('serve()', () => {
		describe('when process() method returns a buffer', () => {
			const result = Buffer.from('speak friend and enter');

			class MockEndpoint extends Endpoint {
				protected static content_type = ContentType.TEXT;

				protected process(): Promise<Buffer> {
					return Promise.resolve(result);
				}

				protected serveError(_error: HttpError): void {
					throw new Error('Not implemented');
				}
			}

			it('sets expected status and headers on response', async () => {
				const request = buildMockRequest('/', HttpMethod.GET, ContentType.TEXT);
				const response = buildMockResponse();
				const write_head_spy = jest.spyOn(response, 'writeHead');
				const endpoint = new MockEndpoint(request, response);

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
				const endpoint = new MockEndpoint(request, response);

				endpoint.serve();

				await sleep(10);

				expect(end_spy).toHaveBeenCalledWith(result);
			});
		});

		describe('when process() method returns a string', () => {
			const result = 'speak friend and enter';

			class MockEndpoint extends Endpoint {
				protected static content_type = ContentType.TEXT;

				protected process(): Promise<string> {
					return Promise.resolve(result);
				}

				protected serveError(_error: HttpError): void {
					throw new Error('Not implemented');
				}
			}

			it('sets expected status and headers on response', async () => {
				const request = buildMockRequest('/', HttpMethod.GET, ContentType.TEXT);
				const response = buildMockResponse();
				const write_head_spy = jest.spyOn(response, 'writeHead');
				const endpoint = new MockEndpoint(request, response);

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
				const endpoint = new MockEndpoint(request, response);

				endpoint.serve();

				await sleep(10);

				expect(end_spy).toHaveBeenCalledWith(result);
			});
		});

		describe('when process() method returns undefined', () => {
			class MockEndpoint extends Endpoint {
				protected static content_type = ContentType.TEXT;

				protected process(): Promise<void> {
					return Promise.resolve();
				}

				protected serveError(_error: HttpError): void {
					throw new Error('Not implemented');
				}
			}

			it('does not set status or headers on response', async () => {
				const request = buildMockRequest('/', HttpMethod.GET, ContentType.TEXT);
				const response = buildMockResponse();
				const write_head_spy = jest.spyOn(response, 'writeHead');
				const endpoint = new MockEndpoint(request, response);

				endpoint.serve();

				await sleep(10);

				expect(write_head_spy).not.toHaveBeenCalled();
			});

			it('does not send any data to response', async () => {
				const request = buildMockRequest('/', HttpMethod.GET, ContentType.TEXT);
				const response = buildMockResponse();
				const end_spy = jest.spyOn(response, 'end');
				const endpoint = new MockEndpoint(request, response);

				endpoint.serve();

				await sleep(10);

				expect(end_spy).not.toHaveBeenCalled();
			});
		});

		describe('when process() method raises an exception', () => {
			it('forwards error to serveError()', async () => {
				expect.assertions(1);

				const expected_error = new NotFoundError();

				class MockEndpoint extends Endpoint {
					protected static content_type = ContentType.TEXT;

					protected process(): Promise<void> {
						return Promise.reject(expected_error);
					}

					protected serveError(error: HttpError): void {
						expect(error).toStrictEqual(expected_error);
					}
				}

				const request = buildMockRequest('/', HttpMethod.GET, ContentType.TEXT);
				const response = buildMockResponse();
				const endpoint = new MockEndpoint(request, response);

				endpoint.serve();

				await sleep(10);
			});

			describe('when process() returns a non-HTTP error', () => {
				it('converts it to a generic HTTP error before passing to serveError()', async () => {
					expect.assertions(2);

					class MockEndpoint extends Endpoint {
						protected static content_type = ContentType.TEXT;

						protected process(): Promise<void> {
							const error = new Error('A weird thing happened');

							return Promise.reject(error);
						}

						protected serveError(error: HttpError): void {
							expect(error).toBeInstanceOf(ServerError);
							expect(error.message).toStrictEqual('A weird thing happened');
						}
					}

					const request = buildMockRequest(
						'/',
						HttpMethod.GET,
						ContentType.TEXT
					);
					const response = buildMockResponse();
					const endpoint = new MockEndpoint(request, response);

					endpoint.serve();

					await sleep(10);
				});
			});
		});
	});

	describe('getRequest()', () => {
		it('returns request', () => {
			class MockEndpoint extends Endpoint {
				protected static content_type = ContentType.JSON;

				public privilegedGetRequest(): HTTP.IncomingMessage {
					return this.getRequest();
				}

				protected process(): Promise<undefined> {
					throw new Error('Not implemented');
				}

				protected serveError(_error: HttpError): void {
					throw new Error('Not implemented');
				}
			}

			const request = buildMockRequest('/x', HttpMethod.GET, ContentType.JSON);
			const response = buildMockResponse();
			const endpoint = new MockEndpoint(request, response);
			const actual_request = endpoint.privilegedGetRequest();

			expect(actual_request).toStrictEqual(request);
		});
	});

	describe('getResponse()', () => {
		it('returns response', () => {
			class MockEndpoint extends Endpoint {
				protected static content_type = ContentType.JSON;

				public privilegedGetResponse(): HTTP.ServerResponse {
					return this.getResponse();
				}

				protected process(): Promise<undefined> {
					throw new Error('Not implemented');
				}

				protected serveError(_error: HttpError): void {
					throw new Error('Not implemented');
				}
			}

			const request = buildMockRequest('/x', HttpMethod.GET, ContentType.JSON);
			const response = buildMockResponse();
			const endpoint = new MockEndpoint(request, response);
			const actual_response = endpoint.privilegedGetResponse();

			expect(actual_response).toStrictEqual(response);
		});
	});

	describe('getResponseHeaders()', () => {
		it('returns expected response headers', () => {
			class MockEndpoint extends Endpoint {
				protected static content_type = ContentType.JSON;

				public privilegedGetResponseHeaders(): HeaderMap {
					return this.getResponseHeaders();
				}

				protected process(): Promise<undefined> {
					throw new Error('Not implemented');
				}

				protected serveError(_error: HttpError): void {
					throw new Error('Not implemented');
				}
			}

			const request = buildMockRequest('/x', HttpMethod.GET, ContentType.JSON);
			const response = buildMockResponse();
			const endpoint = new MockEndpoint(request, response);
			const headers = endpoint.privilegedGetResponseHeaders();

			expect(headers).toStrictEqual({
				[HttpHeader.CONTENT_TYPE]: ContentType.JSON,
			});
		});
	});
});
