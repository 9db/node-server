import Node from 'type/node';
import SystemId from 'system/enum/id';
import ChangeNode from 'type/node/change';
import FieldValue from 'type/field-value';
import ChangeStatus from 'enum/change-status';
import KeyGenerator from 'utility/key-generator';
import buildNodeUrl from 'utility/build-node-url';
import getNodeParameters from 'utility/get-node-parameters';
import Operation, { OperationInput } from 'operation';

interface Input extends OperationInput {
	readonly node: Node;
	readonly field: string;
	readonly old_value: FieldValue;
	readonly new_value: FieldValue;
}

class ChangeFieldOperation extends Operation<Input, Node> {
	protected async performInternal(): Promise<Node> {
		await this.addChangeNode();

		return this.performFieldChange();
	}

	private async addChangeNode(): Promise<void> {
		const change_node = this.buildChangeNode();
		const repository = this.getRepository();

		await repository.storeNode(change_node);

		const node = this.getNode();

		const parameters = getNodeParameters(node.url);
		const old_value = node.changes;
		const new_value = [...old_value, change_node.url];

		// TODO: Use enum for 'changes' below
		await repository.setField(parameters, 'changes', old_value, new_value);
	}

	private performFieldChange(): Promise<Node> {
		const node = this.getNode();
		const field_key = this.getFieldKey();
		const parameters = getNodeParameters(node.url);
		const repository = this.getRepository();
		const old_value = this.getOldValue();
		const new_value = this.getNewValue();

		return repository.setField(parameters, field_key, old_value, new_value);
	}

	private buildChangeNode(): ChangeNode {
		const url = this.getChangeUrl();
		const type_url = this.getChangeTypeUrl();
		const hostname = this.getHostname();
		const status = ChangeStatus.APPROVED;
		const field = this.getFieldKey();
		const old_value = this.getOldValue();
		const new_value = this.getNewValue();
		const creator = `${hostname}/account/anonymous`;
		const approver = `${hostname}/account/system`;
		const changes: string[] = [];
		const permissions: string[] = [];
		const created_at = Date.now();
		const updated_at = created_at;

		return {
			url,
			type: type_url,
			status,
			field,
			old_value,
			new_value,
			approver,
			creator,
			created_at,
			updated_at,
			changes,
			permissions
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

	private getNode(): Node {
		const input = this.getInput();

		return input.node;
	}

	private getFieldKey(): string {
		const input = this.getInput();

		return input.field;
	}

	private getOldValue(): FieldValue {
		const input = this.getInput();

		return input.old_value;
	}

	private getNewValue(): FieldValue {
		const input = this.getInput();

		return input.new_value;
	}
}

export default ChangeFieldOperation;
