import Node from 'type/node';
import Operation from 'operation';
import Repository from 'repository';
import ChangeType from 'enum/change-type';
import BadRequestError from 'http/error/bad-request';
import { PrimitiveValue } from 'type/field-value';
import ChangeFieldOperation from 'operation/change-field';

export interface ChangeInput {
	readonly change_type: ChangeType;
	readonly field: string;
	readonly value: PrimitiveValue;
	readonly previous_value: PrimitiveValue | null;
}

export interface Input {
	readonly namespace_key: string;
	readonly type_key: string;
	readonly key: string;
	readonly changes: ChangeInput[];
}

class UpdateNodeOperation extends Operation<Node> {
	private input: Input;

	public constructor(repository: Repository, input: Input) {
		super(repository);

		this.input = input;
	}

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
		const repository = this.getRepository();
		const namespace_key = this.getNamespaceKey();
		const type_key = this.getTypeKey();
		const key = this.getNodeKey();

		const input = {
			namespace_key,
			type_key,
			key,
			...change
		};

		const service = new ChangeFieldOperation(repository, input);

		return service.perform();
	}

	private getChanges(): ChangeInput[] {
		const input = this.getInput();

		return input.changes;
	}

	private getNamespaceKey(): string {
		const input = this.getInput();

		return input.namespace_key;
	}

	private getTypeKey(): string {
		const input = this.getInput();

		return input.type_key;
	}

	private getNodeKey(): string {
		const input = this.getInput();

		return input.key;
	}

	private getInput(): Input {
		return this.input;
	}
}

export default UpdateNodeOperation;
