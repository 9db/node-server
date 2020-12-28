import SystemId from 'system/enum/id';
import TypeNode from 'type/type-node';
import DraftField from 'type/draft-field';
import InstanceNode from 'type/instance-node';
import KeyGenerator from 'utility/key-generator';
import buildNodeUrl from 'utility/build-node-url';
import NodeParameters from 'type/node-parameters';
import LoadNodeFromUrlOperation from 'operation/load-node-from-url';
import AddValueToSetFieldOperation from 'operation/add-value-to-set-field';
import Operation, { OperationInput } from 'operation';

interface Input extends OperationInput {
	readonly node_parameters: NodeParameters;
	readonly fields: DraftField[];
}

class CreateInstanceOperation extends Operation<Input, InstanceNode> {
	protected async performInternal(): Promise<InstanceNode> {
		const instance_node = await this.createInstance();

		await this.addInstanceToType(instance_node);

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

	private async createInstance(): Promise<InstanceNode> {
		const node = this.buildNode();
		const repository = this.getRepository();

		return repository.storeNode(node);
	}

	private buildNode(): InstanceNode {
		const url = this.getUrl();
		const type_url = this.getTypeUrl();
		const draft_fields = this.getDraftFields();
		const creator = this.getAccountUrl();
		const changes = this.getChangesUrl();
		const created_at = Date.now();
		const updated_at = created_at;

		let node: InstanceNode = {
			url,
			type: type_url,
			creator,
			created_at,
			updated_at,
			changes
		};

		draft_fields.forEach((draft_field) => {
			const { key, value } = draft_field;

			node = {
				...node,
				[key]: value
			};
		});

		return node;
	}

	private async addInstanceToType(instance_node: InstanceNode): Promise<void> {
		const type_node = await this.fetchTypeNode();
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			node: type_node,
			field_key: 'instances',
			value: instance_node.url,
			repository,
			account
		};

		const operation = new AddValueToSetFieldOperation(input);

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

	private getChangesUrl(): string {
		const hostname = this.getHostname();

		return buildNodeUrl(hostname, {
			type_id: SystemId.CHANGE_LIST_TYPE,
			id: KeyGenerator.id()
		});
	}
}

export default CreateInstanceOperation;
