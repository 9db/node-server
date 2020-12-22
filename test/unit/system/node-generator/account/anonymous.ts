import SystemId from 'system/enum/id';
import AnonymousAccountGenerator from 'system/node-generator/account/anonymous';

describe('AnonymousAccountGenerator', () => {
	const hostname = 'https://9db.org';

	describe('generate()', () => {
		it('returns expected node data', () => {
			const generator = new AnonymousAccountGenerator(hostname);
			const node = generator.generate();

			expect(node).toStrictEqual({
				id: SystemId.ANONYMOUS_ACCOUNT,
				type_id: SystemId.ACCOUNT_TYPE,
				creator: `${hostname}/account/system`,
				created_at: 0,
				updated_at: 0,
				changes: []
			});
		});
	});
});
