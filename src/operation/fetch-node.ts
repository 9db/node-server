import Node from 'type/node';
import Adapter from 'interface/adapter';
import Operation from 'operation';
import NotFoundError from 'http/error/not-found';

interface Input {
	readonly namespace_key: string;
	readonly type_key: string;
	readonly key: string;
}

class FetchNodeOperation extends Operation<Node> {
	private input: Input;

	public constructor(adapter: Adapter, input: Input) {
		super(adapter);

		this.input = input;
	}

	protected async performInternal(): Promise<Node> {
		const input = this.getInput();
		const adapter = this.getAdapter();

		const node = await adapter.fetchNode(
			input.namespace_key,
			input.type_key,
			input.key
		);

		if (node === undefined) {
			throw new NotFoundError();
		}

		return node;
	}

	private getInput(): Input {
		return this.input;
	}
}

export default FetchNodeOperation;
