import sleep from 'utility/sleep';

describe('sleep()', () => {
	it('returns a promise that resolves after the specified delay', async () => {
		const start_time = Date.now();
		const delay = 500;

		await sleep(delay);

		const end_time = Date.now();
		const delta = end_time - start_time;

		expect(delta).toBeGreaterThanOrEqual(delay);
	});
});
