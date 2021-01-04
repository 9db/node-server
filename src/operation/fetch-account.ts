import SystemId from 'system/enum/id';
import AccountNode from 'type/node/account';
import UnauthorizedError from 'http/error/unauthorized';
import BasicAuthCredentials from 'http/type/basic-auth-credentials';
import Operation, { OperationInput } from 'operation';

interface Input extends OperationInput {
	readonly credentials: BasicAuthCredentials;
}

class FetchAccountOperation extends Operation<Input, AccountNode> {
	protected async performInternal(): Promise<AccountNode> {
		const account_id = await this.fetchAccountId();

		return this.fetchAccount(account_id);
	}

	private async fetchAccount(account_id: string): Promise<AccountNode> {
		const repository = this.getRepository();

		const account = await repository.fetchNode({
			type_id: SystemId.ACCOUNT_TYPE,
			id: account_id
		});

		if (account === undefined) {
			throw new UnauthorizedError();
		}

		return account as AccountNode;
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
