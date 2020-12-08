import HttpMethod from 'http/enum/method';
import ContentType from 'http/enum/content-type';
import buildMockRequest from 'test/utility/build-mock-request';
import JsonNotFoundRoute from 'route/json/not-found';

describe('JsonNotFoundRoute', () => {
	describe('accepts()', () => {
		const route = new JsonNotFoundRoute();

		describe('when given a request whose URL does not match', () => {
			const request = buildMockRequest(
				'/gandalf',
				HttpMethod.GET,
				ContentType.JSON
			);

			it('returns true', () => {
				expect(route.accepts(request)).toBe(true);
			});
		});

		describe('when given a request whose method does not match', () => {
			const request = buildMockRequest(
				'/404',
				HttpMethod.POST,
				ContentType.JSON
			);

			it('returns true', () => {
				expect(route.accepts(request)).toBe(true);
			});
		});

		describe('when given a request whose content type does not match', () => {
			const request = buildMockRequest(
				'/404',
				HttpMethod.GET,
				ContentType.TEXT
			);

			it('returns false', () => {
				expect(route.accepts(request)).toBe(false);
			});
		});

		describe('when given a matching request', () => {
			const request = buildMockRequest(
				'/404',
				HttpMethod.GET,
				ContentType.JSON
			);

			it('returns true', () => {
				expect(route.accepts(request)).toBe(true);
			});
		});
	});
});
