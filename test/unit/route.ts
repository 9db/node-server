import HTTP from 'http';

import Route from 'route';
import HttpMethod from 'http/enum/method';
import ContentType from 'http/enum/content-type';
import MockEndpoint from 'test/mock/endpoint';
import RouteInterface from 'interface/route';
import buildMockRequest from 'test/utility/build-mock-request';
import buildMockResponse from 'test/utility/build-mock-response';

describe('Route', () => {
	describe('accepts()', () => {
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

	describe('serve()', () => {
		it('delegates to the supplied endpoint', () => {
			expect.assertions(4);

			const request = buildMockRequest('/', HttpMethod.GET, ContentType.TEXT);
			const response = buildMockResponse();

			class ThrowawayEndpoint extends MockEndpoint {
				public constructor(
					supplied_request: HTTP.IncomingMessage,
					supplied_response: HTTP.ServerResponse,
					supplied_route: RouteInterface
				) {
					expect(supplied_request).toStrictEqual(request);
					expect(supplied_response).toStrictEqual(response);
					expect(supplied_route).toStrictEqual(route);

					super(supplied_request, supplied_response, supplied_route);
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

			route.serve(request, response);

			expect(serve_spy).toHaveBeenCalled();
		});
	});
});
