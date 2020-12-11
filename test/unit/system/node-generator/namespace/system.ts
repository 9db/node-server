import SystemKey from 'system/enum/key';
import SystemNamespaceGenerator from 'system/node-generator/namespace/system';

describe('SystemNamespaceGenerator', () => {
	const hostname = 'https://9db.org';

	describe('generate()', () => {
		it('returns expected node data', () => {
			const generator = new SystemNamespaceGenerator(hostname);
			const node = generator.generate();

			expect(node).toStrictEqual({
				namespace_key: SystemKey.SYSTEM_NAMESPACE,
				type_key: SystemKey.NAMESPACE_TYPE,
				key: SystemKey.SYSTEM_NAMESPACE,
				creator: `${hostname}/system/account/system`,
				created_at: 0,
				updated_at: 0
			});
		});
	});
});
