import SystemKey from 'system/enum/key';
import SystemCache from 'system/cache';

describe('SystemCache', () => {
	describe('fetchNode()', () => {
		const hostname = 'https://9db.org';
		const creator = `${hostname}/system/account/system`;
		const cache = new SystemCache(hostname);

		describe('when fetching the generic type', () => {
			it('returns expected node', () => {
				const node = cache.fetchNode(
					SystemKey.SYSTEM_NAMESPACE,
					SystemKey.GENERIC_TYPE,
					SystemKey.GENERIC_TYPE
				);

				expect(node).toStrictEqual({
					namespace_key: SystemKey.SYSTEM_NAMESPACE,
					type_key: SystemKey.GENERIC_TYPE,
					key: SystemKey.GENERIC_TYPE,
					creator,
					created_at: 0,
					updated_at: 0,
				});
			});
		});

		describe('when fetching the account type', () => {
			it('returns expected node', () => {
				const node = cache.fetchNode(
					SystemKey.SYSTEM_NAMESPACE,
					SystemKey.GENERIC_TYPE,
					SystemKey.ACCOUNT_TYPE
				);

				expect(node).toStrictEqual({
					namespace_key: SystemKey.SYSTEM_NAMESPACE,
					type_key: SystemKey.GENERIC_TYPE,
					key: SystemKey.ACCOUNT_TYPE,
					creator,
					created_at: 0,
					updated_at: 0,
				});
			});
		});

		describe('when fetching the namespace type', () => {
			it('returns expected node', () => {
				const node = cache.fetchNode(
					SystemKey.SYSTEM_NAMESPACE,
					SystemKey.GENERIC_TYPE,
					SystemKey.NAMESPACE_TYPE
				);

				expect(node).toStrictEqual({
					namespace_key: SystemKey.SYSTEM_NAMESPACE,
					type_key: SystemKey.GENERIC_TYPE,
					key: SystemKey.NAMESPACE_TYPE,
					creator,
					created_at: 0,
					updated_at: 0,
				});
			});
		});

		describe('when fetching the system namespace', () => {
			it('returns expected node', () => {
				const node = cache.fetchNode(
					SystemKey.SYSTEM_NAMESPACE,
					SystemKey.NAMESPACE_TYPE,
					SystemKey.SYSTEM_NAMESPACE
				);

				expect(node).toStrictEqual({
					namespace_key: SystemKey.SYSTEM_NAMESPACE,
					type_key: SystemKey.NAMESPACE_TYPE,
					key: SystemKey.SYSTEM_NAMESPACE,
					creator,
					created_at: 0,
					updated_at: 0,
				});
			});
		});

		describe('when fetching the system account', () => {
			it('returns expected node', () => {
				const node = cache.fetchNode(
					SystemKey.SYSTEM_NAMESPACE,
					SystemKey.ACCOUNT_TYPE,
					SystemKey.SYSTEM_ACCOUNT
				);

				expect(node).toStrictEqual({
					namespace_key: SystemKey.SYSTEM_NAMESPACE,
					type_key: SystemKey.ACCOUNT_TYPE,
					key: SystemKey.SYSTEM_ACCOUNT,
					creator,
					created_at: 0,
					updated_at: 0,
				});
			});
		});

		describe('when fetching the anonymous account', () => {
			it('returns expected node', () => {
				const node = cache.fetchNode(
					SystemKey.SYSTEM_NAMESPACE,
					SystemKey.ACCOUNT_TYPE,
					SystemKey.ANONYMOUS_ACCOUNT
				);

				expect(node).toStrictEqual({
					namespace_key: SystemKey.SYSTEM_NAMESPACE,
					type_key: SystemKey.ACCOUNT_TYPE,
					key: SystemKey.ANONYMOUS_ACCOUNT,
					creator,
					created_at: 0,
					updated_at: 0,
				});
			});
		});

		describe('when fetching a node that does not exist', () => {
			it('returns undefined', () => {
				const node = cache.fetchNode(
					SystemKey.SYSTEM_NAMESPACE,
					SystemKey.ACCOUNT_TYPE,
					'gandalf'
				);

				expect(node).toStrictEqual(undefined);
			});
		});
	});
});
