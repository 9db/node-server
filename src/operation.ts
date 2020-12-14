import Node from 'type/node';
import Repository from 'repository';

export interface OperationInput {
	readonly repository: Repository;
	readonly account: Node;
}

abstract class Operation<Input extends OperationInput, Output> {
	private input: Input;

	public constructor(input: Input) {
		this.input = input;
	}

	public async perform(): Promise<Output> {
		try {
			const result = await this.performInternal();

			return result;
		} catch (error) {
			this.logFailure(error);

			throw error;
		}
	}

	protected getRepository(): Repository {
		const input = this.getInput();

		return input.repository;
	}

	protected getAccount(): Node {
		const input = this.getInput();

		return input.account;
	}

	protected getInput(): Input {
		return this.input;
	}

	private logFailure(error: Error): void {
		console.error(error);
	}

	protected abstract performInternal(): Promise<Output>;
}

export default Operation;
