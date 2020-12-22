import Node from 'type/node';
import NotFoundError from 'http/error/not-found';
import Operation, {OperationInput} from 'operation';

interface Input extends OperationInput {
	readonly id: string;
	readonly type_id: string;
}

class FetchNodeOperation extends Operation<Input, Node> {
	protected async performInternal(): Promise<Node> {
		const input = this.getInput();
		const repository = this.getRepository();

		const node = await repository.fetchNode(
			input.type_id,
			input.id
		);

		if (node === undefined) {
			throw new NotFoundError();
		}

		return node;
	}
}

export default FetchNodeOperation;
