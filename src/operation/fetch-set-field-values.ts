import Node from 'type/node';
import { PrimitiveValue } from 'type/field-value';
import Operation, { OperationInput } from 'operation';

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 50;

interface Input extends OperationInput {
	readonly node: Node;
	readonly field_key: string;
	readonly offset?: number;
	readonly limit?: number;
}

class FetchSetFieldValuesOperation extends Operation<Input, PrimitiveValue[]> {
	protected performInternal(): Promise<PrimitiveValue[]> {
		const repository = this.getRepository();
		const type_id = this.getTypeId();
		const node_id = this.getNodeId();
		const field_key = this.getFieldKey();
		const offset = this.getOffset();
		const limit = this.getLimit();

		return repository.fetchValuesFromSet(
			type_id,
			node_id,
			field_key,
			offset,
			limit
		);
	}

	private getTypeId(): string {
		const node = this.getNode();

		return node.type_id;
	}

	private getNodeId(): string {
		const node = this.getNode();

		return node.id;
	}

	private getFieldKey(): string {
		const input = this.getInput();

		return input.field_key;
	}

	private getOffset(): number {
		const input = this.getInput();

		if (input.offset === undefined) {
			return DEFAULT_OFFSET;
		}

		return input.offset;
	}

	private getLimit(): number {
		const input = this.getInput();

		if (input.limit === undefined) {
			return DEFAULT_LIMIT;
		}

		return input.limit;
	}

	private getNode(): Node {
		const input = this.getInput();

		return input.node;
	}
}

export default FetchSetFieldValuesOperation;
