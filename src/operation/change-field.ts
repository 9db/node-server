import Node from 'type/node';
import SystemId from 'system/enum/id';
import FieldValue from 'type/field-value';
import ChangeType from 'enum/change-type';
import ChangeStatus from 'enum/change-status';
import KeyGenerator from 'utility/key-generator';
import buildNodeUrl from 'utility/build-node-url';
import BadRequestError from 'http/error/bad-request';
import getNodeParameters from 'utility/get-node-parameters';
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

		const parameters = {
			type_id: SystemId.CHANGE_LIST_TYPE,
			id: changes_id
		};

		await repository.addValueToList(parameters, change_node.url);
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
		const parameters = getNodeParameters(node.url);
		const repository = this.getRepository();

		return repository.setField(
			parameters,
			input.field,
			input.value
		);
	}

	private async performAddSetValueOperation(): Promise<Node> {
		const input = this.getInput();
		const node = input.node;
		const set_url = node[input.field];

		if (typeof set_url !== 'string') {
			throw new Error(`No set url specified for field ${input.field}`);
		}

		const parameters = getNodeParameters(set_url);
		const repository = this.getRepository();

		await repository.addValueToSet(parameters, input.value);

		return node;
	}

	private async performRemoveSetValueOperation(): Promise<Node> {
		const input = this.getInput();
		const node = input.node;
		const set_url = node[input.field];

		if (typeof set_url !== 'string') {
			throw new Error(`No set url specified for field ${input.field}`);
		}

		const parameters = getNodeParameters(set_url);
		const repository = this.getRepository();

		await repository.removeValueFromSet(parameters, input.value);

		return node;
	}

	private async performAddListValueOperation(): Promise<Node> {
		const input = this.getInput();
		const node = input.node;
		const list_url = node[input.field];

		if (typeof list_url !== 'string') {
			throw new Error(`No list url specified for field ${input.field}`);
		}

		const parameters = getNodeParameters(list_url);
		const repository = this.getRepository();

		await repository.addValueToList(parameters, input.value);

		return node;
	}

	private async performRemoveListValueOperation(): Promise<Node> {
		const input = this.getInput();
		const node = input.node;
		const list_url = node[input.field];

		if (typeof list_url !== 'string') {
			throw new Error(`No list url specified for field ${input.field}`);
		}

		const parameters = getNodeParameters(list_url);
		const repository = this.getRepository();

		await repository.removeValueFromList(parameters, input.value);

		return node;
	}

	private buildChangeNode(): Node {
		const url = this.getChangeUrl();
		const type_url = this.getChangeTypeUrl();
		const hostname = this.getHostname();
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
			type: type_url,
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

	private getChangeUrl(): string {
		const hostname = this.getHostname();
		const type_id = SystemId.CHANGE_TYPE;
		const id = KeyGenerator.id();

		return buildNodeUrl(hostname, {
			type_id,
			id
		});
	}

	private getChangeTypeUrl(): string {
		const hostname = this.getHostname();
		const type_id = SystemId.GENERIC_TYPE;
		const id = SystemId.CHANGE_TYPE;

		return buildNodeUrl(hostname, {
			type_id,
			id
		});
	}

	private getHostname(): string {
		const repository = this.getRepository();

		return repository.getHostname();
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
