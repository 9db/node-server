import Node from 'type/node';
import Adapter from 'interface/adapter';
import Operation from 'operation';
import FieldValue from 'type/field-value';

interface Input {
	readonly namespace_key: string;
	readonly type_key: string;
	readonly key: string;
	readonly [key: string]: FieldValue;
}

class CreateNodeOperation extends Operation<Node> {
	private input: Input;

	public constructor(adapter: Adapter, input: Input) {
		super(adapter);

		this.input = input;
	}

	protected async performInternal(): Promise<Node> {
		const node = await this.buildNode();
		const adapter = this.getAdapter();

		return adapter.storeNode(node);
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
			updated_at,
		};
	}

	private getInput(): Input {
		return this.input;
	}
}

export default CreateNodeOperation;
