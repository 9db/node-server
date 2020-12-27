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
			url: this.getNodeUrl(),
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

	private getNodeUrl(): string {
		const hostname = this.getHostname();
		const type_id = this.getTypeId();
		const node_id = this.getNodeId();

		if (type_id === SystemId.GENERIC_TYPE) {
			return `${hostname}/${node_id}`;
		} else {
			return `${hostname}/${type_id}/${node_id}`;
		}
	}

	protected abstract getTypeId(): string;
	protected abstract getNodeId(): string;
}

export interface GeneratorConstructor {
	new (hostname: string): SystemNodeGenerator;
}

export default SystemNodeGenerator;
