import Node from 'type/node';
import Template from 'template';
import SystemId from 'system/enum/id';
import getNodeParameters from 'utility/get-node-parameters';

interface Input {
	readonly account: Node;
}

class AccountMenuTemplate extends Template<Input> {
	protected getHtml(): string {
		if (this.isAuthenticated()) {
			return this.renderAuthenticated();
		} else {
			return this.renderUnauthenticated();
		}
	}

	private renderAuthenticated(): string {
		const account_id = this.getAccountId();
		const account_url = this.getAccountUrl();

		return `
			<menu>
				<span>logged in as</span>
				<a href="${account_url}">${account_id}</a>.
				<a href="/logout">log out</a>
			</menu>
		`;
	}

	private renderUnauthenticated(): string {
		return `
			<menu>
				<a href="/login">log in</a>
				<span>or</span>
				<a href="/register">register</a>
			</menu>
		`;
	}

	private isAuthenticated(): boolean {
		const account_id = this.getAccountId();

		return account_id !== SystemId.ANONYMOUS_ACCOUNT;
	}

	private getAccountId(): string {
		const account = this.getAccount();
		const parameters = getNodeParameters(account.url);

		return parameters.id;
	}

	private getAccountUrl(): string {
		const account = this.getAccount();

		return account.url;
	}

	private getAccount(): Node {
		const input = this.getInput();

		return input.account;
	}
}

export default AccountMenuTemplate;
