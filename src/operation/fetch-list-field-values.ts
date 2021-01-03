import Node from 'type/node';
import FieldValue from 'type/field-value';
import getNodeParameters from 'utility/get-node-parameters';
import Operation, { OperationInput } from 'operation';

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 50;

interface Input extends OperationInput {
	readonly node: Node;
	readonly field_key: string;
	readonly offset?: number;
	readonly limit?: number;
}

class FetchListFieldValuesOperation extends Operation<Input, FieldValue[]> {
	protected performInternal(): Promise<FieldValue[]> {
		const repository = this.getRepository();
		const list_url = this.getListUrl();
		const parameters = getNodeParameters(list_url);
		const offset = this.getOffset();
		const limit = this.getLimit();

		if (this.isSet()) {
			return repository.fetchValuesFromSet(parameters, offset, limit);
		} else {
			return repository.fetchValuesFromList(parameters, offset, limit);
		}
	}

	private isSet(): boolean {
		const list_type_id = this.getListTypeId();

		return list_type_id.endsWith('-set');
	}

	private getListUrl(): string {
		const node = this.getNode();
		const field_key = this.getFieldKey();
		const list_url = node[field_key];

		if (typeof list_url !== 'string') {
			throw new Error(
				`Invalid value for list url field: ${field_key}: ${typeof list_url}`
			);
		}

		return list_url;
	}

	private getListTypeId(): string {
		const list_url = this.getListUrl();
		const parameters = getNodeParameters(list_url);

		return parameters.type_id;
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

export default FetchListFieldValuesOperation;
