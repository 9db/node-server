import SystemKey from 'system/enum/key';
import GenericTypeGenerator from 'system/node-generator/type/generic';

describe('GenericTypeGenerator', () => {
	const hostname = 'https://9db.org';

	describe('generate()', () => {
		it('returns expected node data', () => {
			const generator = new GenericTypeGenerator(hostname);
			const node = generator.generate();

			expect(node).toStrictEqual({
				namespace_key: SystemKey.SYSTEM_NAMESPACE,
				type_key: SystemKey.GENERIC_TYPE,
				key: SystemKey.GENERIC_TYPE,
				creator: `${hostname}/system/account/system`,
				created_at: 0,
				updated_at: 0,
				changes: []
			});
		});
	});
});
