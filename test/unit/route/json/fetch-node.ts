import HttpMethod from 'http/enum/method';
import ContentType from 'http/enum/content-type';
import buildMockRequest from 'test/utility/build-mock-request';
import JsonFetchNodeRoute from 'route/json/fetch-node';

describe('JsonFetchNodeRoute', () => {
	describe('accepts()', () => {
		const route = new JsonFetchNodeRoute();

		describe('when given a request whose URL does not match', () => {
			const request = buildMockRequest(
				'/public/type',
				HttpMethod.GET,
				ContentType.JSON
			);

			it('returns false', () => {
				expect(route.accepts(request)).toBe(false);
			});
		});

		describe('when given a request whose method does not match', () => {
			const request = buildMockRequest(
				'/public/type/wizard',
				HttpMethod.POST,
				ContentType.JSON
			);

			it('returns false', () => {
				expect(route.accepts(request)).toBe(false);
			});
		});

		describe('when given a request whose content type does not match', () => {
			const request = buildMockRequest(
				'/public/type/wizard',
				HttpMethod.GET,
				ContentType.TEXT
			);

			it('returns false', () => {
				expect(route.accepts(request)).toBe(false);
			});
		});

		describe('when given a matching request', () => {
			const request = buildMockRequest(
				'/public/type/wizard',
				HttpMethod.GET,
				ContentType.JSON
			);

			it('returns true', () => {
				expect(route.accepts(request)).toBe(true);
			});
		});
	});
});
