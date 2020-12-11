import HTTP from 'http';

import Route from 'route';
import Repository from 'repository';
import HttpMethod from 'http/enum/method';
import ContentType from 'http/enum/content-type';
import MockEndpoint from 'test/mock/endpoint';
import MemoryAdapter from 'adapter/memory';
import UrlParameters from 'http/type/url-parameters';
import buildMockRequest from 'test/utility/build-mock-request';
import buildMockResponse from 'test/utility/build-mock-response';

describe('Route', () => {
	describe('accepts()', () => {
		describe('when using a simple static path', () => {
			const route = new Route(
				ContentType.TEXT,
				HttpMethod.GET,
				'/foo',
				MockEndpoint
			);

			describe('when given a request with an undefined url', () => {
				const request = buildMockRequest(
					undefined,
					HttpMethod.GET,
					ContentType.TEXT
				);

				it('returns false', () => {
					expect(route.accepts(request)).toBe(false);
				});
			});

			describe('when given a request whose URL does not match', () => {
				const request = buildMockRequest(
					'/bar',
					HttpMethod.GET,
					ContentType.TEXT
				);

				it('returns false', () => {
					expect(route.accepts(request)).toBe(false);
				});
			});

			describe('when given a request whose method does not match', () => {
				const request = buildMockRequest(
					'/foo',
					HttpMethod.POST,
					ContentType.TEXT
				);

				it('returns false', () => {
					expect(route.accepts(request)).toBe(false);
				});
			});

			describe('when given a request whose content type does not match', () => {
				const request = buildMockRequest(
					'/foo',
					HttpMethod.GET,
					ContentType.JSON
				);

				it('returns false', () => {
					expect(route.accepts(request)).toBe(false);
				});
			});

			describe('when given a matching request', () => {
				const request = buildMockRequest(
					'/foo',
					HttpMethod.GET,
					ContentType.TEXT
				);

				it('returns true', () => {
					expect(route.accepts(request)).toBe(true);
				});
			});
		});

		describe('when using a complex parameterized path', () => {
			const route = new Route(
				ContentType.TEXT,
				HttpMethod.GET,
				'/v1/:namespace/type/:node_key',
				MockEndpoint
			);

			describe('when given a request whose URL matches only the first part of the path', () => {
				const request = buildMockRequest(
					'/v1/foo/type',
					HttpMethod.GET,
					ContentType.TEXT
				);

				it('returns false', () => {
					expect(route.accepts(request)).toBe(false);
				});
			});

			describe('when given a request whose URL matches only the last part of the path', () => {
				const request = buildMockRequest(
					'/foo/type/bar',
					HttpMethod.GET,
					ContentType.TEXT
				);

				it('returns false', () => {
					expect(route.accepts(request)).toBe(false);
				});
			});

			describe('when given a request whose URL matches the full path', () => {
				const request = buildMockRequest(
					'/v1/h23klj9/type/23kjl2g2',
					HttpMethod.GET,
					ContentType.TEXT
				);

				it('returns true', () => {
					expect(route.accepts(request)).toBe(true);
				});
			});
		});
	});

	describe('serve()', () => {
		it('delegates to the supplied endpoint', () => {
			expect.assertions(5);

			const request = buildMockRequest(
				'/wizards/gandalf/weapons/glamdring',
				HttpMethod.GET,
				ContentType.TEXT
			);

			const response = buildMockResponse();
			const hostname = 'https://9db.org';
			const adapter = new MemoryAdapter();
			const repository = new Repository(hostname, adapter);

			const expected_parameters = {
				wizard: 'gandalf',
				weapon: 'glamdring'
			};

			class ThrowawayEndpoint extends MockEndpoint {
				public constructor(
					supplied_request: HTTP.IncomingMessage,
					supplied_response: HTTP.ServerResponse,
					supplied_parameters: UrlParameters,
					supplied_repository: Repository
				) {
					expect(supplied_request).toStrictEqual(request);
					expect(supplied_response).toStrictEqual(response);
					expect(supplied_parameters).toStrictEqual(expected_parameters);
					expect(supplied_repository).toStrictEqual(repository);

					super(
						supplied_request,
						supplied_response,
						supplied_parameters,
						supplied_repository
					);
				}
			}

			const route = new Route(
				ContentType.TEXT,
				HttpMethod.GET,
				'/wizards/:wizard/weapons/:weapon',
				ThrowawayEndpoint
			);

			const serve_spy = jest.spyOn(ThrowawayEndpoint.prototype, 'serve');

			serve_spy.mockImplementation(() => {
				return undefined;
			});

			route.serve(request, response, repository);

			expect(serve_spy).toHaveBeenCalled();
		});

		describe('when given a request with an undefined url', () => {
			it('passes an empty request parameters to the endpoint', () => {
				expect.assertions(1);

				const request = buildMockRequest(
					undefined,
					HttpMethod.GET,
					ContentType.TEXT
				);

				const response = buildMockResponse();
				const hostname = 'https://9db.org';
				const adapter = new MemoryAdapter();
				const repository = new Repository(hostname, adapter);

				class ThrowawayEndpoint extends MockEndpoint {
					public constructor(
						supplied_request: HTTP.IncomingMessage,
						supplied_response: HTTP.ServerResponse,
						supplied_parameters: UrlParameters,
						supplied_repository: Repository
					) {
						expect(supplied_parameters).toStrictEqual({});

						super(
							supplied_request,
							supplied_response,
							supplied_parameters,
							supplied_repository
						);
					}
				}

				const route = new Route(
					ContentType.TEXT,
					HttpMethod.GET,
					'/wizards/:wizard/weapons/:weapon',
					ThrowawayEndpoint
				);

				const serve_spy = jest.spyOn(ThrowawayEndpoint.prototype, 'serve');

				serve_spy.mockImplementation(() => {
					return undefined;
				});

				route.serve(request, response, repository);
			});
		});
	});
});
