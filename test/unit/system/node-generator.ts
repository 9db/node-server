import SystemNodeGenerator from 'system/node-generator';

describe('NodeGenerator', () => {
	class MockGenerator extends SystemNodeGenerator {
		protected getTypeId(): string {
			return 'foo';
		}

		protected getNodeId(): string {
			return 'bar';
		}
	}

	const hostname = 'https://9db.org';

	describe('generate()', () => {
		it('returns the expected node data', () => {
			const generator = new MockGenerator(hostname);
			const node = generator.generate();

			expect(node).toStrictEqual({
				id: 'bar',
				type_id: 'foo',
				creator: `${hostname}/account/system`,
				created_at: 0,
				updated_at: 0,
				changes: []
			});
		});
	});

	describe('getCreator()', () => {
		class ThrowawayGenerator extends MockGenerator {
			public privilegedGetCreator(): string {
				return this.getCreator();
			}
		}

		it('returns the expected value', () => {
			const generator = new ThrowawayGenerator(hostname);
			const creator = generator.privilegedGetCreator();

			expect(creator).toStrictEqual(`${hostname}/account/system`);
		});
	});
});
