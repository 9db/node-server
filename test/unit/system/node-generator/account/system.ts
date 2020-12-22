import SystemId from 'system/enum/id';
import SystemAccountGenerator from 'system/node-generator/account/system';

describe('SystemAccountGenerator', () => {
	const hostname = 'https://9db.org';

	describe('generate()', () => {
		it('returns expected node data', () => {
			const generator = new SystemAccountGenerator(hostname);
			const node = generator.generate();

			expect(node).toStrictEqual({
				id: SystemId.SYSTEM_ACCOUNT,
				type_id: SystemId.ACCOUNT_TYPE,
				creator: `${hostname}/account/system`,
				created_at: 0,
				updated_at: 0,
				changes: []
			});
		});
	});
});
