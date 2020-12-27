import Node from 'type/node';
import ChangeType from 'enum/change-type';
import BadRequestError from 'http/error/bad-request';
import { PrimitiveValue } from 'type/field-value';
import FetchNodeOperation from 'operation/fetch-node';
import ChangeFieldOperation from 'operation/change-field';
import Operation, { OperationInput } from 'operation';

export interface ChangeInput {
	readonly change_type: ChangeType;
	readonly field: string;
	readonly value: PrimitiveValue;
	readonly previous_value: PrimitiveValue | null;
}

export interface Input extends OperationInput {
	readonly id: string;
	readonly type_id: string;
	readonly changes: ChangeInput[];
}

class UpdateNodeOperation extends Operation<Input, Node> {
	protected async performInternal(): Promise<Node> {
		const changes = this.getChanges();

		let index = 0;
		let node = await this.fetchNode();

		while (index < changes.length) {
			const change = changes[index];

			node = await this.applyChange(node, change);

			index++;
		}

		if (node === undefined) {
			throw new BadRequestError();
		}

		return node;
	}

	private applyChange(node: Node, change: ChangeInput): Promise<Node> {
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			...change,
			node,
			repository,
			account
		};

		const service = new ChangeFieldOperation(input);

		return service.perform();
	}

	private fetchNode(): Promise<Node> {
		const id = this.getNodeId();
		const type_id = this.getTypeId();
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			id,
			type_id,
			repository,
			account
		};

		const operation = new FetchNodeOperation(input);

		return operation.perform();
	}

	private getChanges(): ChangeInput[] {
		const input = this.getInput();

		return input.changes;
	}

	private getTypeId(): string {
		const input = this.getInput();

		return input.type_id;
	}

	private getNodeId(): string {
		const input = this.getInput();

		return input.id;
	}
}

export default UpdateNodeOperation;
