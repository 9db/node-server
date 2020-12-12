import KeyGenerator from 'utility/key-generator';

describe('KeyGenerator', () => {
	describe('id', () => {
		it('returns an id in the expected format', () => {
			const id = KeyGenerator.id();

			expect(id).toHaveLength(13);
			expect(/^[0-9a-z]+$/.test(id)).toBe(true);
		});
	});
});
