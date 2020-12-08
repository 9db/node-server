import JsonRoute from 'route/json';
import HttpMethod from 'http/enum/method';
import ContentType from 'http/enum/content-type';
import MockEndpoint from 'test/mock/endpoint';
import MemoryAdapter from 'adapter/memory';
import buildMockRequest from 'test/utility/build-mock-request';

describe('JsonRoute', () => {
	describe('accepts()', () => {
		const adapter = new MemoryAdapter();

		const route = new JsonRoute(
			HttpMethod.GET,
			'/wizard',
			MockEndpoint,
			adapter
		);

		it('accepts matching requests with a JSON accept header', () => {
			const request = buildMockRequest(
				'/wizard',
				HttpMethod.GET,
				ContentType.JSON
			);

			expect(route.accepts(request)).toBe(true);
		});

		it('does not accept requests without a JSON accept header', () => {
			const request = buildMockRequest(
				'/wizard',
				HttpMethod.GET,
				ContentType.TEXT
			);

			expect(route.accepts(request)).toBe(false);
		});
	});
});
