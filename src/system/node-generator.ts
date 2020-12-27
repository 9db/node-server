import Node from 'type/node';
import SystemId from 'system/enum/id';
import KeyGenerator from 'utility/key-generator';
import buildNodeUrl from 'utility/build-node-url';

abstract class SystemNodeGenerator {
	private hostname: string;

	public constructor(hostname: string) {
		this.hostname = hostname;
	}

	public generate(): Node {
		return {
			id: this.getNodeId(),
			type_id: this.getTypeId(),
			creator: this.getCreator(),
			created_at: 0,
			updated_at: 0,
			changes: this.getChangesUrl()
		};
	}

	protected getCreator(): string {
		const hostname = this.getHostname();
		const id = SystemId.SYSTEM_ACCOUNT;
		const type_id = SystemId.ACCOUNT_TYPE;

		return buildNodeUrl(hostname, {
			id,
			type_id
		});
	}

	private getChangesUrl(): string {
		const hostname = this.getHostname();
		const id = KeyGenerator.id();
		const type_id = SystemId.CHANGE_LIST_TYPE;

		return buildNodeUrl(hostname, {
			id,
			type_id
		});
	}

	private getHostname(): string {
		return this.hostname;
	}

	protected abstract getTypeId(): string;
	protected abstract getNodeId(): string;
}

export interface GeneratorConstructor {
	new (hostname: string): SystemNodeGenerator;
}

export default SystemNodeGenerator;
