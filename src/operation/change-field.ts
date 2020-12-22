import Node from 'type/node';
import SystemId from 'system/enum/id';
import ChangeType from 'enum/change-type';
import ChangeStatus from 'enum/change-status';
import KeyGenerator from 'utility/key-generator';
import BadRequestError from 'http/error/bad-request';
import { PrimitiveValue } from 'type/field-value';
import Operation, {OperationInput} from 'operation';

interface Input extends OperationInput {
	readonly id: string;
	readonly type_id: string;
	readonly change_type: ChangeType;
	readonly field: string;
	readonly value: PrimitiveValue;
	readonly previous_value?: PrimitiveValue;
}

class ChangeFieldOperation extends Operation<Input, Node> {
	protected async performInternal(): Promise<Node> {
		await this.addChangeNode();

		return this.performFieldChange();
	}

	private async addChangeNode(): Promise<void> {
		const input = this.getInput();
		const change_node = this.buildChangeNode();
		const repository = this.getRepository();

		await repository.storeNode(change_node);

		const change_url = repository.buildNodeUrl(change_node);

		await repository.addValueToList(
			input.type_id,
			input.id,
			'changes',
			change_url
		);
	}

	private performFieldChange(): Promise<Node> {
		const change_type = this.getInputChangeType();

		switch (change_type) {
			case ChangeType.SET_FIELD_VALUE:
				return this.performSetFieldValueOperation();
			case ChangeType.ADD_LIST_VALUE:
				return this.performAddListValueOperation();
			case ChangeType.REMOVE_LIST_VALUE:
				return this.performRemoveListValueOperation();
			case ChangeType.ADD_SET_VALUE:
				return this.performAddSetValueOperation();
			case ChangeType.REMOVE_SET_VALUE:
				return this.performRemoveSetValueOperation();
			default:
				throw new BadRequestError();
		}
	}

	private performSetFieldValueOperation(): Promise<Node> {
		const input = this.getInput();
		const repository = this.getRepository();

		return repository.setField(
			input.type_id,
			input.id,
			input.field,
			input.value
		);
	}

	private performAddListValueOperation(): Promise<Node> {
		const input = this.getInput();
		const repository = this.getRepository();

		return repository.addValueToList(
			input.type_id,
			input.id,
			input.field,
			input.value
		);
	}

	private performRemoveListValueOperation(): Promise<Node> {
		const input = this.getInput();
		const repository = this.getRepository();

		return repository.removeValueFromList(
			input.type_id,
			input.id,
			input.field,
			input.value
		);
	}

	private performAddSetValueOperation(): Promise<Node> {
		const input = this.getInput();
		const repository = this.getRepository();

		return repository.addValueToSet(
			input.type_id,
			input.id,
			input.field,
			input.value
		);
	}

	private performRemoveSetValueOperation(): Promise<Node> {
		const input = this.getInput();
		const repository = this.getRepository();

		return repository.removeValueFromSet(
			input.type_id,
			input.id,
			input.field,
			input.value
		);
	}

	private buildChangeNode(): Node {
		const id = KeyGenerator.id();
		const type_id = SystemId.CHANGE_TYPE;
		const status = ChangeStatus.APPROVED;
		const change_type = this.getInputChangeType();
		const field = this.getInputField();
		const value = this.getInputValue();
		const previous_value = this.getInputPreviousValue();
		const creator = 'https://9db.org/account/anonymous';
		const approver = 'https://9db.org/account/system';
		const created_at = Date.now();
		const updated_at = created_at;

		return {
			id,
			type_id,
			status,
			change_type,
			field,
			value,
			previous_value,
			approver,
			creator,
			created_at,
			updated_at,
			changes: []
		};
	}

	private getInputField(): string {
		const input = this.getInput();

		return input.field;
	}

	private getInputValue(): PrimitiveValue {
		const input = this.getInput();

		return input.value;
	}

	private getInputPreviousValue(): PrimitiveValue {
		const input = this.getInput();

		if (input.previous_value === undefined) {
			return null;
		}

		return input.previous_value;
	}

	private getInputChangeType(): ChangeType {
		const input = this.getInput();

		return input.change_type;
	}
}

export default ChangeFieldOperation;
