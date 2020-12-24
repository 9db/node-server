import Node from 'type/node';
import DraftField from 'type/draft-field';
import Operation, { OperationInput } from 'operation';

interface Input extends OperationInput {
	readonly id: string;
	readonly type_id: string;
	readonly fields: DraftField[];
}

class CreateInstanceOperation extends Operation<Input, Node> {
	protected async performInternal(): Promise<Node> {
		const node = await this.buildNode();
		const repository = this.getRepository();

		return repository.storeNode(node);
	}

	private async buildNode(): Promise<Node> {
		const id = this.getId();
		const type_id = this.getTypeId();
		const draft_fields = this.getDraftFields();
		const creator = this.getAccountUrl();
		const created_at = Date.now();
		const updated_at = created_at;

		let node: Node = {
			id,
			type_id,
			creator,
			created_at,
			updated_at,
			changes: []
		};

		draft_fields.forEach((draft_field) => {
			const {key, value} = draft_field;

			node = {
				...node,
				[key]: value
			};
		});

		return node;
	}

	private getId(): string {
		const input = this.getInput();

		return input.id;
	}

	private getTypeId(): string {
		const input = this.getInput();

		return input.type_id;
	}

	private getDraftFields(): DraftField[] {
		const input = this.getInput();

		return input.fields;
	}

	private getAccountUrl(): string {
		const account = this.getAccount();
		const repository = this.getRepository();

		return repository.buildNodeUrl(account);
	}
}

export default CreateInstanceOperation;
