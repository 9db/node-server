import Node from 'type/node';
import SystemId from 'system/enum/id';
import KeyGenerator from 'utility/key-generator';
import buildNodeUrl from 'utility/build-node-url';
import NodeParameters from 'type/node-parameters';

abstract class SystemNodeGenerator {
	private hostname: string;

	public constructor(hostname: string) {
		this.hostname = hostname;
	}

	public generate(): Node {
		return {
			url: this.getNodeUrl(),
			type: this.getTypeUrl(),
			creator: this.getCreatorUrl(),
			created_at: 0,
			updated_at: 0,
			changes: this.getChangesUrl()
		};
	}

	protected getCreatorUrl(): string {
		return this.buildNodeUrl({
			type_id: SystemId.ACCOUNT_TYPE,
			id: SystemId.SYSTEM_ACCOUNT
		});
	}

	private getNodeUrl(): string {
		const parameters = this.getNodeParameters();

		return this.buildNodeUrl(parameters);
	}

	private getTypeUrl(): string {
		const parameters = this.getNodeParameters();

		return this.buildNodeUrl({
			type_id: SystemId.GENERIC_TYPE,
			id: parameters.type_id
		});
	}

	private getChangesUrl(): string {
		return this.buildNodeUrl({
			type_id: SystemId.CHANGE_LIST_TYPE,
			id: KeyGenerator.id()
		});
	}

	private getHostname(): string {
		return this.hostname;
	}

	private buildNodeUrl(parameters: NodeParameters): string {
		const hostname = this.getHostname();

		return buildNodeUrl(hostname, parameters);
	}

	protected abstract getNodeParameters(): NodeParameters;
}

export interface GeneratorConstructor {
	new (hostname: string): SystemNodeGenerator;
}

export default SystemNodeGenerator;
