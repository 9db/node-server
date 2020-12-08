import HttpMethod from 'http/enum/method';
import ContentType from 'http/enum/content-type';
import buildMockRequest from 'test/utility/build-mock-request';
import PlaintextVersionRoute from 'route/plaintext/version';

describe('PlaintextVersionRoute', () => {
	describe('accepts()', () => {
		const route = new PlaintextVersionRoute();

		describe('when given a request whose URL does not match', () => {
			const request = buildMockRequest(
				'/info',
				HttpMethod.GET,
				ContentType.TEXT
			);

			it('returns false', () => {
				expect(route.accepts(request)).toBe(false);
			});
		});

		describe('when given a request whose method does not match', () => {
			const request = buildMockRequest(
				'/version',
				HttpMethod.POST,
				ContentType.TEXT
			);

			it('returns false', () => {
				expect(route.accepts(request)).toBe(false);
			});
		});

		describe('when given a request whose content type does not match', () => {
			const request = buildMockRequest(
				'/version',
				HttpMethod.GET,
				ContentType.JSON
			);

			it('returns false', () => {
				expect(route.accepts(request)).toBe(false);
			});
		});

		describe('when given a matching request', () => {
			const request = buildMockRequest(
				'/version',
				HttpMethod.GET,
				ContentType.TEXT
			);

			it('returns true', () => {
				expect(route.accepts(request)).toBe(true);
			});
		});
	});
});
