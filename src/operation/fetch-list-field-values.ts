import Node from 'type/node';
import { ListValue } from 'type/field-value';
import BadRequestError from 'http/error/bad-request';
import Operation, { OperationInput } from 'operation';

interface Input extends OperationInput {
	readonly node: Node;
	readonly field_key: string;
}

class FetchListFieldValuesOperation extends Operation<Input, ListValue> {
	protected performInternal(): Promise<ListValue> {
		const node = this.getNode();
		const field_key = this.getFieldKey();
		const list = node[field_key] as ListValue;

		if (!Array.isArray(list)) {
			throw new BadRequestError(`
				Expected a list for field ${field_key}, but got ${typeof list}
			`);
		}

		return Promise.resolve(list);
	}

	private getFieldKey(): string {
		const input = this.getInput();

		return input.field_key;
	}

	private getNode(): Node {
		const input = this.getInput();

		return input.node;
	}
}

export default FetchListFieldValuesOperation;
