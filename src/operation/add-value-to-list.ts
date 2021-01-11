import Node from 'type/node';
import BadRequestError from 'http/error/bad-request';
import getNodeParameters from 'utility/get-node-parameters';
import { PrimitiveValue, ListValue } from 'type/field-value';
import Operation, { OperationInput } from 'operation';

interface Input extends OperationInput {
	readonly node: Node;
	readonly field_key: string;
	readonly value: PrimitiveValue;
}

class AddValueToListFieldOperation extends Operation<Input, void> {
	protected async performInternal(): Promise<void> {
		const repository = this.getRepository();
		const node = this.getNode();
		const parameters = getNodeParameters(node.url);
		const list_value = this.getValue();
		const field_key = this.getFieldKey();
		const old_list = node[field_key];

		if (!Array.isArray(old_list)) {
			throw new BadRequestError(`
				Tried to add value ${list_value} to field ${field_key},
				but it was not a list (got ${typeof old_list})
			`);
		}

		const new_list = [...old_list, list_value] as ListValue;

		await repository.setField(parameters, field_key, old_list, new_list);
	}

	private getNode(): Node {
		const input = this.getInput();

		return input.node;
	}

	private getFieldKey(): string {
		const input = this.getInput();

		return input.field_key;
	}

	private getValue(): PrimitiveValue {
		const input = this.getInput();

		return input.value;
	}
}

export default AddValueToListFieldOperation;
