import Node from 'type/node';
import SystemId from 'system/enum/id';
import DraftField from 'type/draft-field';
import KeyGenerator from 'utility/key-generator';
import buildNodeUrl from 'utility/build-node-url';
import NodeParameters from 'type/node-parameters';
import Operation, { OperationInput } from 'operation';

interface Input extends OperationInput {
	readonly node_parameters: NodeParameters;
	readonly fields: DraftField[];
}

class CreateInstanceOperation extends Operation<Input, Node> {
	protected async performInternal(): Promise<Node> {
		const node = await this.buildNode();
		const repository = this.getRepository();

		return repository.storeNode(node);
	}

	private async buildNode(): Promise<Node> {
		const url = this.getUrl();
		const type_url = this.getTypeUrl();
		const draft_fields = this.getDraftFields();
		const creator = this.getAccountUrl();
		const changes = this.getChangesUrl();
		const created_at = Date.now();
		const updated_at = created_at;

		let node: Node = {
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

	private getUrl(): string {
		const repository = this.getRepository();
		const hostname = repository.getHostname();
		const parameters = this.getNodeParameters();

		return buildNodeUrl(hostname, parameters);
	}

	private getTypeUrl(): string {
		const repository = this.getRepository();
		const hostname = repository.getHostname();
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
		const repository = this.getRepository();
		const hostname = repository.getHostname();
		const type_id = SystemId.CHANGE_LIST_TYPE;
		const id = KeyGenerator.id();

		return `${hostname}/${type_id}/${id}`;
	}
}

export default CreateInstanceOperation;
