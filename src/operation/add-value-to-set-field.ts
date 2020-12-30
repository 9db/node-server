import Node from 'type/node';
import FieldValue from 'type/field-value';
import getNodeParameters from 'utility/get-node-parameters';
import Operation, { OperationInput } from 'operation';

interface Input extends OperationInput {
	readonly node: Node;
	readonly field_key: string;
	readonly value: FieldValue;
}

class AddValueToSetFieldOperation extends Operation<Input, void> {
	protected performInternal(): Promise<void> {
		const repository = this.getRepository();
		const set_url = this.getSetUrl();
		const parameters = getNodeParameters(set_url);
		const value = this.getValue();

		return repository.addValueToSet(parameters, value);
	}

	private getSetUrl(): string {
		const node = this.getNode();
		const field_key = this.getFieldKey();
		const set_url = node[field_key];

		if (typeof set_url !== 'string') {
			throw new Error(`
				Set url field ${field_key} on node ${node.url} was not a string
			`);
		}

		return set_url;
	}

	private getNode(): Node {
		const input = this.getInput();

		return input.node;
	}

	private getFieldKey(): string {
		const input = this.getInput();

		return input.field_key;
	}

	private getValue(): FieldValue {
		const input = this.getInput();

		return input.value;
	}
}

export default AddValueToSetFieldOperation;
