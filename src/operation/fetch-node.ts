import Node from 'type/node';
import Operation from 'operation';
import Repository from 'repository';
import NotFoundError from 'http/error/not-found';

interface Input {
	readonly namespace_key: string;
	readonly type_key: string;
	readonly key: string;
}

class FetchNodeOperation extends Operation<Node> {
	private input: Input;

	public constructor(repository: Repository, input: Input) {
		super(repository);

		this.input = input;
	}

	protected async performInternal(): Promise<Node> {
		const input = this.getInput();
		const repository = this.getRepository();

		const node = await repository.fetchNode(
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
