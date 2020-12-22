import SystemId from 'system/enum/id';
import GenericTypeGenerator from 'system/node-generator/type/generic';

describe('GenericTypeGenerator', () => {
	const hostname = 'https://9db.org';

	describe('generate()', () => {
		it('returns expected node data', () => {
			const generator = new GenericTypeGenerator(hostname);
			const node = generator.generate();

			expect(node).toStrictEqual({
				id: SystemId.GENERIC_TYPE,
				type_id: SystemId.GENERIC_TYPE,
				creator: `${hostname}/system/account/system`,
				created_at: 0,
				updated_at: 0,
				changes: []
			});
		});
	});
});
