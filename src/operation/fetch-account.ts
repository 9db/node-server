import Node from 'type/node';
import Operation from 'operation';
import SystemKey from 'system/enum/key';
import Repository from 'repository';
import UnauthorizedError from 'http/error/unauthorized';

interface Input {
	readonly username: string;
	readonly password: string;
}

class FetchAccountOperation extends Operation<Node> {
	private username: string;
	private password: string;

	public constructor(repository: Repository, input: Input) {
		super(repository);

		this.username = input.username;
		this.password = input.password;
	}

	protected async performInternal(): Promise<Node> {
		const account_key = await this.fetchAccountKey();

		return this.fetchAccount(account_key);
	}

	private async fetchAccount(account_key: string): Promise<Node> {
		const repository = this.getRepository();

		const account = await repository.fetchNode(
			SystemKey.SYSTEM_NAMESPACE,
			SystemKey.ACCOUNT_TYPE,
			account_key
		);

		if (account === undefined) {
			throw new UnauthorizedError();
		}

		return account;
	}

	private async fetchAccountKey(): Promise<string> {
		const repository = this.getRepository();
		const username = this.getUsername();
		const password = this.getPassword();
		const account_key = await repository.fetchAccountKey(username, password);

		if (account_key === undefined) {
			throw new UnauthorizedError();
		}

		return account_key;
	}

	private getUsername(): string {
		return this.username;
	}

	private getPassword(): string {
		return this.password;
	}
}

export default FetchAccountOperation;
