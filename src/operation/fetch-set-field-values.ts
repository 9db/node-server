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
		const set_url = this.getSetUrl();
		const parts = set_url.split('/');
		const set_id = parts.pop() as string;
		const set_type_id = parts.pop() as string;
		const offset = this.getOffset();
		const limit = this.getLimit();

		return repository.fetchValuesFromSet(set_type_id, set_id, offset, limit);
	}

	private getSetUrl(): string {
		const node = this.getNode();
		const field_key = this.getFieldKey();
		const set_url = node[field_key];

		if (typeof set_url !== 'string') {
			throw new Error(
				`Invalid value for set url field: ${field_key}: ${typeof set_url}`
			);
		}

		return set_url;
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
