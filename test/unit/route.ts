import Route from 'route';
import HttpMethod from 'http/enum/method';
import ContentType from 'http/enum/content-type';
import MockEndpoint from 'test/mock/endpoint';
import buildMockRequest from 'test/utility/build-mock-request';

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
});
