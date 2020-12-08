import HttpMethod from 'http/enum/method';
import ContentType from 'http/enum/content-type';
import MockEndpoint from 'test/mock/endpoint';
import PlaintextRoute from 'route/plaintext';
import buildMockRequest from 'test/utility/build-mock-request';

describe('PlaintextRoute', () => {
	describe('accepts()', () => {
		const route = new PlaintextRoute(HttpMethod.GET, '/wizards', MockEndpoint);

		it('accepts matching requests with a plaintext accept header', () => {
			const request = buildMockRequest(
				'/wizards',
				HttpMethod.GET,
				ContentType.TEXT
			);

			expect(route.accepts(request)).toBe(true);
		});

		it('does not accept requests without a plaintext accept header', () => {
			const request = buildMockRequest(
				'/wizards',
				HttpMethod.GET,
				ContentType.JSON
			);

			expect(route.accepts(request)).toBe(false);
		});
	});
});
