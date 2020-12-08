import Node from 'type/node';
import Operation from 'operation';
import NodeFactory from 'factory/node';

interface Input {
	readonly namespace_key: string;
	readonly type_key: string;
	readonly key: string;
}

class FetchNodeOperation extends Operation<Node> {
	private input: Input;

	public constructor(input: Input) {
		super();

		this.input = input;
	}

	protected performInternal(): Promise<Node> {
		const input = this.getInput();
		const node = NodeFactory.create({
			...input,
		});

		return Promise.resolve(node);
	}

	private getInput(): Input {
		return this.input;
	}
}

export default FetchNodeOperation;
