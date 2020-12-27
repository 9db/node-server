import Node from 'type/node';
import SystemId from 'system/enum/id';
import FieldValue from 'type/field-value';
import ChangeType from 'enum/change-type';
import ChangeStatus from 'enum/change-status';
import KeyGenerator from 'utility/key-generator';
import BadRequestError from 'http/error/bad-request';
import Operation, { OperationInput } from 'operation';

interface Input extends OperationInput {
	readonly node: Node;
	readonly change_type: ChangeType;
	readonly field: string;
	readonly value: FieldValue;
	readonly previous_value?: FieldValue;
}

class ChangeFieldOperation extends Operation<Input, Node> {
	protected async performInternal(): Promise<Node> {
		await this.addChangeNode();

		return this.performFieldChange();
	}

	private async addChangeNode(): Promise<void> {
		const changes_id = this.getChangesId();
		const change_node = this.buildChangeNode();
		const repository = this.getRepository();

		await repository.storeNode(change_node);

		const change_url = repository.buildNodeUrl(change_node);

		await repository.addValueToList(
			SystemId.CHANGE_LIST_TYPE,
			changes_id,
			change_url
		);
	}

	private getChangesId(): string {
		const input = this.getInput();
		const node = input.node;
		const changes_url = node.changes;

		if (typeof changes_url !== 'string') {
			throw new Error(`Invalid change list url for node: ${changes_url}`);
		}

		const parts = changes_url.split('/');
		const changes_id = parts.pop() as string;

		if (typeof changes_id !== 'string') {
			throw new Error(`Invalid changes id: ${changes_id}`);
		}

		return changes_id;
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
		const node = input.node;
		const repository = this.getRepository();

		return repository.setField(node.type_id, node.id, input.field, input.value);
	}

	private async performAddSetValueOperation(): Promise<Node> {
		const input = this.getInput();
		const node = input.node;
		const set_url = node[input.field];

		if (typeof set_url !== 'string') {
			throw new Error(`No set url specified for field ${input.field}`);
		}

		const parts = set_url.split('/');
		const set_id = parts.pop() as string;
		const set_type_id = parts.pop() as string;

		if (set_type_id.endsWith('-set') === false) {
			throw new Error(
				`Invalid set type for field ${input.field}: ${set_type_id}`
			);
		}

		const repository = this.getRepository();

		await repository.addValueToSet(set_type_id, set_id, input.value);

		return node;
	}

	private async performRemoveSetValueOperation(): Promise<Node> {
		const input = this.getInput();
		const node = input.node;
		const set_url = node[input.field];

		if (typeof set_url !== 'string') {
			throw new Error(`No set url specified for field ${input.field}`);
		}

		const parts = set_url.split('/');
		const set_id = parts.pop() as string;
		const set_type_id = parts.pop() as string;

		if (set_type_id.endsWith('-set') === false) {
			throw new Error(
				`Invalid set type for field ${input.field}: ${set_type_id}`
			);
		}

		const repository = this.getRepository();

		await repository.removeValueFromSet(set_type_id, set_id, input.value);

		return node;
	}

	private async performAddListValueOperation(): Promise<Node> {
		const input = this.getInput();
		const node = input.node;
		const list_url = node[input.field];

		if (typeof list_url !== 'string') {
			throw new Error(`No list url specified for field ${input.field}`);
		}

		const parts = list_url.split('/');
		const list_id = parts.pop() as string;
		const list_type_id = parts.pop() as string;

		if (list_type_id.endsWith('-list') === false) {
			throw new Error(
				`Invalid list type for field ${input.field}: ${list_type_id}`
			);
		}

		const repository = this.getRepository();

		await repository.addValueToList(list_type_id, list_id, input.value);

		return node;
	}

	private async performRemoveListValueOperation(): Promise<Node> {
		const input = this.getInput();
		const node = input.node;
		const list_url = node[input.field];

		if (typeof list_url !== 'string') {
			throw new Error(`No list url specified for field ${input.field}`);
		}

		const parts = list_url.split('/');
		const list_id = parts.pop() as string;
		const list_type_id = parts.pop() as string;

		if (list_type_id.endsWith('-list') === false) {
			throw new Error(
				`Invalid list type for field ${input.field}: ${list_type_id}`
			);
		}

		const repository = this.getRepository();

		await repository.removeValueFromList(list_type_id, list_id, input.value);

		return node;
	}

	private buildChangeNode(): Node {
		const repository = this.getRepository();
		const hostname = repository.getHostname();
		const id = KeyGenerator.id();
		const type_id = SystemId.CHANGE_TYPE;
		const url = `${hostname}/${type_id}/${id}`;
		const status = ChangeStatus.APPROVED;
		const change_type = this.getInputChangeType();
		const field = this.getInputField();
		const value = this.getInputValue();
		const previous_value = this.getInputPreviousValue();
		const creator = `${hostname}/account/anonymous`;
		const approver = `${hostname}/account/system`;
		const changes = `${hostname}/change-list/non`;
		const created_at = Date.now();
		const updated_at = created_at;

		return {
			url,
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
			changes
		};
	}

	private getInputField(): string {
		const input = this.getInput();

		return input.field;
	}

	private getInputValue(): FieldValue {
		const input = this.getInput();

		return input.value;
	}

	private getInputPreviousValue(): FieldValue {
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
