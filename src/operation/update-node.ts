import Node from 'type/node';
import ChangeType from 'enum/change-type';
import BadRequestError from 'http/error/bad-request';
import { PrimitiveValue } from 'type/field-value';
import ChangeFieldOperation from 'operation/change-field';
import Operation, {OperationInput} from 'operation';

export interface ChangeInput {
	readonly change_type: ChangeType;
	readonly field: string;
	readonly value: PrimitiveValue;
	readonly previous_value: PrimitiveValue | null;
}

export interface Input extends OperationInput {
	readonly type_key: string;
	readonly key: string;
	readonly changes: ChangeInput[];
}

class UpdateNodeOperation extends Operation<Input, Node> {
	protected async performInternal(): Promise<Node> {
		const changes = this.getChanges();

		let index = 0;
		let node: Node | undefined;

		while (index < changes.length) {
			const change = changes[index];

			node = await this.applyChange(change);

			index++;
		}

		if (node === undefined) {
			throw new BadRequestError();
		}

		return node;
	}

	private applyChange(change: ChangeInput): Promise<Node> {
		const type_key = this.getTypeKey();
		const key = this.getNodeKey();
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			type_key,
			key,
			...change,
			repository,
			account
		};

		const service = new ChangeFieldOperation(input);

		return service.perform();
	}

	private getChanges(): ChangeInput[] {
		const input = this.getInput();

		return input.changes;
	}

	private getTypeKey(): string {
		const input = this.getInput();

		return input.type_key;
	}

	private getNodeKey(): string {
		const input = this.getInput();

		return input.key;
	}
}

export default UpdateNodeOperation;
