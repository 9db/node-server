import Node from 'type/node';
import Operation from 'operation';
import Repository from 'repository';
import FieldValue from 'type/field-value';

interface Input {
	readonly namespace_key: string;
	readonly type_key: string;
	readonly key: string;
	readonly [key: string]: FieldValue;
}

class CreateNodeOperation extends Operation<Node> {
	private input: Input;

	public constructor(repository: Repository, input: Input) {
		super(repository);

		this.input = input;
	}

	protected async performInternal(): Promise<Node> {
		const node = await this.buildNode();
		const repository = this.getRepository();

		return repository.storeNode(node);
	}

	private async buildNode(): Promise<Node> {
		const input = this.getInput();
		const creator = await this.loadAccountUrl();
		const created_at = Date.now();
		const updated_at = created_at;

		return {
			...input,
			creator,
			created_at,
			updated_at
		};
	}

	private getInput(): Input {
		return this.input;
	}
}

export default CreateNodeOperation;
