import HttpMethod from 'http/enum/method';
import ContentType from 'http/enum/content-type';
import buildMockRequest from 'test/utility/build-mock-request';
import JsonFetchInstanceRoute from 'route/json/fetch-instance';

describe('JsonFetchInstanceRoute', () => {
	describe('accepts()', () => {
		const route = new JsonFetchInstanceRoute();

		describe('when given a request whose URL does not match', () => {
			const request = buildMockRequest(
				'/type',
				HttpMethod.GET,
				ContentType.JSON
			);

			it('returns false', () => {
				expect(route.accepts(request)).toBe(false);
			});
		});

		describe('when given a request whose method does not match', () => {
			const request = buildMockRequest(
				'/type/wizard',
				HttpMethod.POST,
				ContentType.JSON
			);

			it('returns false', () => {
				expect(route.accepts(request)).toBe(false);
			});
		});

		describe('when given a request whose content type does not match', () => {
			const request = buildMockRequest(
				'/type/wizard',
				HttpMethod.GET,
				ContentType.TEXT
			);

			it('returns false', () => {
				expect(route.accepts(request)).toBe(false);
			});
		});

		describe('when given a matching request', () => {
			const request = buildMockRequest(
				'/type/wizard',
				HttpMethod.GET,
				ContentType.JSON
			);

			it('returns true', () => {
				expect(route.accepts(request)).toBe(true);
			});
		});
	});
});
