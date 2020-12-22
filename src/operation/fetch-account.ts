import Node from 'type/node';
import SystemId from 'system/enum/id';
import UnauthorizedError from 'http/error/unauthorized';
import BasicAuthCredentials from 'http/type/basic-auth-credentials';
import Operation, {OperationInput} from 'operation';

interface Input extends OperationInput {
	readonly credentials: BasicAuthCredentials;
}

class FetchAccountOperation extends Operation<Input, Node> {
	protected async performInternal(): Promise<Node> {
		const account_key = await this.fetchAccountId();

		return this.fetchAccount(account_key);
	}

	private async fetchAccount(account_id: string): Promise<Node> {
		const repository = this.getRepository();

		const account = await repository.fetchNode(
			SystemId.ACCOUNT_TYPE,
			account_id
		);

		if (account === undefined) {
			throw new UnauthorizedError();
		}

		return account;
	}

	private async fetchAccountId(): Promise<string> {
		const repository = this.getRepository();
		const username = this.getUsername();
		const password = this.getPassword();
		const account_key = await repository.fetchAccountId(username, password);

		if (account_key === undefined) {
			throw new UnauthorizedError();
		}

		return account_key;
	}

	private getUsername(): string {
		const credentials = this.getCredentials();

		return credentials.username;
	}

	private getPassword(): string {
		const credentials = this.getCredentials();

		return credentials.password;
	}

	private getCredentials(): BasicAuthCredentials {
		const input = this.getInput();

		return input.credentials;
	}
}

export default FetchAccountOperation;
