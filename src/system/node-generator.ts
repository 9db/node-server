import Node from 'type/node';
import SystemKey from 'system/enum/key';
import buildNodeUrl from 'utility/build-node-url';

abstract class SystemNodeGenerator {
	private hostname: string;

	public constructor(hostname: string) {
		this.hostname = hostname;
	}

	public generate(): Node {
		return {
			type_key: this.getTypeKey(),
			key: this.getNodeKey(),
			creator: this.getCreator(),
			created_at: 0,
			updated_at: 0,
			changes: []
		};
	}

	protected getCreator(): string {
		const hostname = this.getHostname();
		const type_key = SystemKey.ACCOUNT_TYPE;
		const key = SystemKey.SYSTEM_ACCOUNT;

		return buildNodeUrl(hostname, {
			type_key,
			key
		});
	}

	private getHostname(): string {
		return this.hostname;
	}

	protected abstract getTypeKey(): string;
	protected abstract getNodeKey(): string;
}

export interface GeneratorConstructor {
	new (hostname: string): SystemNodeGenerator;
}

export default SystemNodeGenerator;
