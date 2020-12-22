import SystemId from 'system/enum/id';
import AccountTypeGenerator from 'system/node-generator/type/account';

describe('AccountTypeGenerator', () => {
	const hostname = 'https://9db.org';

	describe('generate()', () => {
		it('returns expected node data', () => {
			const generator = new AccountTypeGenerator(hostname);
			const node = generator.generate();

			expect(node).toStrictEqual({
				id: SystemId.ACCOUNT_TYPE,
				type_id: SystemId.GENERIC_TYPE,
				creator: `${hostname}/system/account/system`,
				created_at: 0,
				updated_at: 0,
				changes: []
			});
		});
	});
});
