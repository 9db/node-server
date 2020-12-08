import HTTP from 'http';

import Route from 'route';
import Adapter from 'interface/adapter';
import HttpMethod from 'http/enum/method';
import ContentType from 'http/enum/content-type';
import MockEndpoint from 'test/mock/endpoint';
import MemoryAdapter from 'adapter/memory';
import RouteInterface from 'interface/route';
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

			const request = buildMockRequest('/', HttpMethod.GET, ContentType.TEXT);
			const response = buildMockResponse();
			const adapter = new MemoryAdapter();

			class ThrowawayEndpoint extends MockEndpoint {
				public constructor(
					supplied_request: HTTP.IncomingMessage,
					supplied_response: HTTP.ServerResponse,
					supplied_route: RouteInterface,
					supplied_adapter: Adapter
				) {
					expect(supplied_request).toStrictEqual(request);
					expect(supplied_response).toStrictEqual(response);
					expect(supplied_route).toStrictEqual(route);
					expect(supplied_adapter).toStrictEqual(adapter);

					super(
						supplied_request,
						supplied_response,
						supplied_route,
						supplied_adapter
					);
				}
			}

			const route = new Route(
				ContentType.TEXT,
				HttpMethod.GET,
				'/foo',
				ThrowawayEndpoint
			);

			const serve_spy = jest.spyOn(ThrowawayEndpoint.prototype, 'serve');

			serve_spy.mockImplementation(() => {
				return undefined;
			});

			route.serve(request, response, adapter);

			expect(serve_spy).toHaveBeenCalled();
		});
	});

	describe('getUrlParameter()', () => {
		describe('when the requested parameter exists', () => {
			it('returns the value from the supplied URL', () => {
				const route = new Route(
					ContentType.TEXT,
					HttpMethod.GET,
					'/v1/:wizard/passwords/:password',
					MockEndpoint
				);

				const parameter = route.getUrlParameter(
					'/v1/gandalf/passwords/mellon',
					'wizard'
				);

				expect(parameter).toStrictEqual('gandalf');
			});
		});

		describe('when the supplied URL does not match the route', () => {
			it('returns undefined', () => {
				const route = new Route(
					ContentType.TEXT,
					HttpMethod.GET,
					'/v1/:wizard/passwords/:password',
					MockEndpoint
				);

				const parameter = route.getUrlParameter(
					'/gandalf/passwords/mellon',
					'wizard'
				);

				expect(parameter).toStrictEqual(undefined);
			});
		});

		describe('when the requested parameter does not exist', () => {
			it('returns undefined', () => {
				const route = new Route(
					ContentType.TEXT,
					HttpMethod.GET,
					'/v1/:wizard/passwords/:password',
					MockEndpoint
				);

				const parameter = route.getUrlParameter(
					'/v1/gandalf/passwords/mellon',
					'ringwraith'
				);

				expect(parameter).toStrictEqual(undefined);
			});
		});
	});
});
