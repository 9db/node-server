import SystemKey from 'system/enum/key';
import NamespaceTypeGenerator from 'system/node-generator/type/namespace';

describe('NamespaceTypeGenerator', () => {
	const hostname = 'https://9db.org';

	describe('generate()', () => {
		it('returns expected node data', () => {
			const generator = new NamespaceTypeGenerator(hostname);
			const node = generator.generate();

			expect(node).toStrictEqual({
				namespace_key: SystemKey.SYSTEM_NAMESPACE,
				type_key: SystemKey.GENERIC_TYPE,
				key: SystemKey.NAMESPACE_TYPE,
				creator: `${hostname}/system/account/system`,
				created_at: 0,
				updated_at: 0,
				changes: []
			});
		});
	});
});
