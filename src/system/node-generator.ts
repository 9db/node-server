import Node from 'type/node';
import SystemKey from 'system/enum/key';

abstract class SystemNodeGenerator {
	private hostname: string;

	public constructor(hostname: string) {
		this.hostname = hostname;
	}

	public generate(): Node {
		return {
			namespace_key: this.getNamespaceKey(),
			type_key: this.getTypeKey(),
			key: this.getNodeKey(),
			creator: this.getCreator(),
			created_at: 0,
			updated_at: 0
		};
	}

	protected getNamespaceKey(): string {
		return SystemKey.SYSTEM_NAMESPACE;
	}

	protected getCreator(): string {
		const namespace_key = this.getNamespaceKey();
		const type_key = SystemKey.ACCOUNT_TYPE;
		const node_key = SystemKey.SYSTEM_ACCOUNT;

		return this.buildUrlForKeys(namespace_key, type_key, node_key);
	}

	private buildUrlForKeys(
		namespace_key: string,
		type_key: string,
		node_key: string
	): string {
		const path = `/${namespace_key}/${type_key}/${node_key}`;

		return this.buildUrl(path);
	}

	private buildUrl(path: string): string {
		const hostname = this.getHostname();

		return `${hostname}${path}`;
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
