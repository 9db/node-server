import SystemKey from 'system/enum/key';
import SystemNodeGenerator from 'system/node-generator';

describe('NodeGenerator', () => {
	class MockGenerator extends SystemNodeGenerator {
		protected getTypeKey(): string {
			return 'foo';
		}

		protected getNodeKey(): string {
			return 'bar';
		}
	}

	const hostname = 'https://9db.org';

	describe('generate()', () => {
		it('returns the expected node data', () => {
			const generator = new MockGenerator(hostname);
			const node = generator.generate();

			expect(node).toStrictEqual({
				namespace_key: SystemKey.SYSTEM_NAMESPACE,
				type_key: 'foo',
				key: 'bar',
				creator: `${hostname}/system/account/system`,
				created_at: 0,
				updated_at: 0,
			});
		});
	});

	describe('getNamespaceKey()', () => {
		class ThrowawayGenerator extends MockGenerator {
			public privilegedGetNamespaceKey(): string {
				return this.getNamespaceKey();
			}
		}

		it('returns the expected value', () => {
			const generator = new ThrowawayGenerator(hostname);
			const namespace_key = generator.privilegedGetNamespaceKey();

			expect(namespace_key).toStrictEqual(SystemKey.SYSTEM_NAMESPACE);
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

			expect(creator).toStrictEqual(`${hostname}/system/account/system`);
		});
	});
});
