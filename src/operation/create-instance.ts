import SystemId from 'system/enum/id';
import TypeNode from 'type/type-node';
import DraftField from 'type/draft-field';
import InstanceNode from 'type/instance-node';
import buildNodeUrl from 'utility/build-node-url';
import getFieldKeys from 'utility/get-field-keys';
import NodeParameters from 'type/node-parameters';
import AddValueToListOperation from 'operation/add-value-to-list';
import LoadNodeFromUrlOperation from 'operation/load-node-from-url';
import Operation, { OperationInput } from 'operation';

interface Input extends OperationInput {
	readonly node_parameters: NodeParameters;
	readonly fields: DraftField[];
}

class CreateInstanceOperation extends Operation<Input, InstanceNode> {
	protected async performInternal(): Promise<InstanceNode> {
		const type_node = await this.fetchTypeNode();
		const instance_node = await this.createInstance(type_node);

		await this.addInstanceToType(instance_node, type_node);

		return instance_node;
	}

	private async fetchTypeNode(): Promise<TypeNode> {
		const url = this.getTypeUrl();
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			url,
			repository,
			account
		};

		const operation = new LoadNodeFromUrlOperation(input);
		const node = await operation.perform();

		return node as TypeNode;
	}

	private async createInstance(type_node: TypeNode): Promise<InstanceNode> {
		const node = this.buildNode(type_node);
		const repository = this.getRepository();

		return repository.storeNode(node);
	}

	private buildNode(type_node: TypeNode): InstanceNode {
		const url = this.getUrl();
		const type_url = this.getTypeUrl();
		const draft_fields = this.getDraftFields();
		const creator = this.getAccountUrl();
		const changes: string[] = [];
		const permissions = this.buildPermissions();
		const created_at = Date.now();
		const updated_at = created_at;

		let node: InstanceNode = {
			url,
			type: type_url,
			creator,
			created_at,
			updated_at,
			changes,
			permissions
		};

		draft_fields.forEach((draft_field) => {
			const { key, value } = draft_field;

			node = {
				...node,
				[key]: value
			};
		});

		const type_field_keys = getFieldKeys(type_node);

		type_field_keys.forEach((type_field_key) => {
			if (node[type_field_key] !== undefined) {
				return;
			}

			node = {
				...node,
				[type_field_key]: null
			};
		});

		return node;
	}

	private async addInstanceToType(
		instance_node: InstanceNode,
		type_node: TypeNode
	): Promise<void> {
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			node: type_node,
			field_key: 'instances',
			value: instance_node.url,
			repository,
			account
		};

		const operation = new AddValueToListOperation(input);

		await operation.perform();
	}

	private getUrl(): string {
		const hostname = this.getHostname();
		const parameters = this.getNodeParameters();

		return buildNodeUrl(hostname, parameters);
	}

	private getTypeUrl(): string {
		const hostname = this.getHostname();
		const parameters = this.getNodeParameters();

		return buildNodeUrl(hostname, {
			type_id: SystemId.GENERIC_TYPE,
			id: parameters.type_id
		});
	}

	private buildPermissions(): string[] {
		const hostname = this.getHostname();

		const everyone_read_url = buildNodeUrl(hostname, {
			type_id: SystemId.PERMISSION_TYPE,
			id: SystemId.EVERYONE_READ_PERMISSION
		});

		return [everyone_read_url];
	}

	private getNodeParameters(): NodeParameters {
		const input = this.getInput();

		return input.node_parameters;
	}

	private getDraftFields(): DraftField[] {
		const input = this.getInput();

		return input.fields;
	}

	private getAccountUrl(): string {
		const account = this.getAccount();

		return account.url;
	}
}

export default CreateInstanceOperation;
