import HttpMethod from 'http/enum/method';
import ContentType from 'http/enum/content-type';
import buildMockRequest from 'test/utility/build-mock-request';
import PlaintextNotFoundRoute from 'route/plaintext/not-found';

describe('PlaintextNotFoundRoute', () => {
	describe('accepts()', () => {
		const route = new PlaintextNotFoundRoute();

		describe('when given a request whose URL does not match', () => {
			const request = buildMockRequest(
				'/gandalf',
				HttpMethod.GET,
				ContentType.TEXT
			);

			it('returns true', () => {
				expect(route.accepts(request)).toBe(true);
			});
		});

		describe('when given a request whose method does not match', () => {
			const request = buildMockRequest(
				'/404',
				HttpMethod.POST,
				ContentType.TEXT
			);

			it('returns true', () => {
				expect(route.accepts(request)).toBe(true);
			});
		});

		describe('when given a request whose content type does not match', () => {
			const request = buildMockRequest(
				'/404',
				HttpMethod.GET,
				ContentType.JSON
			);

			it('returns true', () => {
				expect(route.accepts(request)).toBe(true);
			});
		});

		describe('when given a matching request', () => {
			const request = buildMockRequest(
				'/404',
				HttpMethod.GET,
				ContentType.TEXT
			);

			it('returns true', () => {
				expect(route.accepts(request)).toBe(true);
			});
		});
	});
});
