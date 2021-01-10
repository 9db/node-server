import Node from 'type/node';
import SystemId from 'system/enum/id';
import buildUrl from 'utility/build-node-url';
import NodeParameters from 'type/node-parameters';

abstract class SystemNodeBuilder {
	public build(): Node {
		let node: Node = {
			url: this.getNodeUrl(),
			type: this.getTypeUrl(),
			creator: this.getCreatorUrl(),
			created_at: this.getCurrentTimestamp(),
			updated_at: this.getCurrentTimestamp(),
			changes: [],
			permissions: this.getPermissionsUrls()
		};

		if (this.isTypeNode()) {
			node = {
				...node,
				instances: this.getInstanceUrls(),
				child_types: this.getChildTypeUrls(),
				parent_type: this.getParentTypeUrl()
			};
		}

		return node;
	}

	protected getCreatorUrl(): string {
		return this.getSystemAccountUrl();
	}

	protected getSystemAccountUrl(): string {
		return this.buildUrl(SystemId.ACCOUNT_TYPE, SystemId.SYSTEM_ACCOUNT);
	}

	protected getAnonymousAccountUrl(): string {
		return this.buildUrl(SystemId.ACCOUNT_TYPE, SystemId.ANONYMOUS_ACCOUNT);
	}

	protected buildUrl(type_id: string, id: string): string {
		const hostname = this.getHostnamePlaceholder();

		return buildUrl(hostname, {
			type_id,
			id
		});
	}

	protected getPermissionsUrls(): string[] {
		const everyone_read_url = this.buildUrl(
			SystemId.PERMISSION_TYPE,
			SystemId.EVERYONE_READ_PERMISSION
		);

		return [everyone_read_url];
	}

	protected getInstanceUrls(): string[] {
		return [];
	}

	protected getChildTypeUrls(): string[] {
		return [];
	}

	private getCurrentTimestamp(): number {
		return Date.now();
	}

	private getNodeUrl(): string {
		const parameters = this.getNodeParameters();
		const hostname = this.getHostnamePlaceholder();

		return buildUrl(hostname, parameters);
	}

	private getTypeUrl(): string {
		const type_id = this.getTypeId();

		return this.buildUrl(SystemId.GENERIC_TYPE, type_id);
	}

	private getParentTypeUrl(): string {
		return this.buildUrl(SystemId.GENERIC_TYPE, SystemId.GENERIC_TYPE);
	}

	private isTypeNode(): boolean {
		const type_id = this.getTypeId();

		return type_id === SystemId.GENERIC_TYPE;
	}

	private getTypeId(): string {
		const parameters = this.getNodeParameters();

		return parameters.type_id;
	}

	private getHostnamePlaceholder(): string {
		// TODO: Codify this somewhere
		return '<9dbhost>';
	}

	protected abstract getNodeParameters(): NodeParameters;
}

export default SystemNodeBuilder;
