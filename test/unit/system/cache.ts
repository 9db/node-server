import SystemId from 'system/enum/id';
import SystemCache from 'system/cache';

describe('SystemCache', () => {
	describe('fetchNode()', () => {
		const hostname = 'https://9db.org';
		const creator = `${hostname}/account/system`;
		const cache = new SystemCache(hostname);

		describe('when fetching the generic type', () => {
			it('returns expected node', () => {
				const node = cache.fetchNode(
					SystemId.GENERIC_TYPE,
					SystemId.GENERIC_TYPE
				);

				expect(node).toStrictEqual({
					id: SystemId.GENERIC_TYPE,
					type_id: SystemId.GENERIC_TYPE,
					creator,
					created_at: 0,
					updated_at: 0,
					changes: []
				});
			});
		});

		describe('when fetching the account type', () => {
			it('returns expected node', () => {
				const node = cache.fetchNode(
					SystemId.GENERIC_TYPE,
					SystemId.ACCOUNT_TYPE
				);

				expect(node).toStrictEqual({
					id: SystemId.ACCOUNT_TYPE,
					type_id: SystemId.GENERIC_TYPE,
					creator,
					created_at: 0,
					updated_at: 0,
					changes: []
				});
			});
		});

		describe('when fetching the system account', () => {
			it('returns expected node', () => {
				const node = cache.fetchNode(
					SystemId.ACCOUNT_TYPE,
					SystemId.SYSTEM_ACCOUNT
				);

				expect(node).toStrictEqual({
					id: SystemId.SYSTEM_ACCOUNT,
					type_id: SystemId.ACCOUNT_TYPE,
					creator,
					created_at: 0,
					updated_at: 0,
					changes: []
				});
			});
		});

		describe('when fetching the anonymous account', () => {
			it('returns expected node', () => {
				const node = cache.fetchNode(
					SystemId.ACCOUNT_TYPE,
					SystemId.ANONYMOUS_ACCOUNT
				);

				expect(node).toStrictEqual({
					id: SystemId.ANONYMOUS_ACCOUNT,
					type_id: SystemId.ACCOUNT_TYPE,
					creator,
					created_at: 0,
					updated_at: 0,
					changes: []
				});
			});
		});

		describe('when fetching a node that does not exist', () => {
			it('returns undefined', () => {
				const node = cache.fetchNode(
					SystemId.ACCOUNT_TYPE,
					'gandalf'
				);

				expect(node).toStrictEqual(undefined);
			});
		});
	});
});
