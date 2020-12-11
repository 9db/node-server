import SystemKey from 'system/enum/key';
import SystemAccountGenerator from 'system/node-generator/account/system';

describe('SystemAccountGenerator', () => {
	const hostname = 'https://9db.org';

	describe('generate()', () => {
		it('returns expected node data', () => {
			const generator = new SystemAccountGenerator(hostname);
			const node = generator.generate();

			expect(node).toStrictEqual({
				namespace_key: SystemKey.SYSTEM_NAMESPACE,
				type_key: SystemKey.ACCOUNT_TYPE,
				key: SystemKey.SYSTEM_ACCOUNT,
				creator: `${hostname}/system/account/system`,
				created_at: 0,
				updated_at: 0,
				changes: []
			});
		});
	});
});
