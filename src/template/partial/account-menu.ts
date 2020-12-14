import Node from 'type/node';
import Template from 'template';
import SystemKey from 'system/enum/key';

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
		const account_key = this.getAccountKey();
		const account_url = this.getAccountUrl();

		return `
			<menu>
				<span>Logged in as</span>
				<a href="${account_url}">${account_key}</a>.
				<a href="/logout">Log out</a>
			</menu>
		`;
	}

	private renderUnauthenticated(): string {
		return `
			<menu>
				<a href="/login">Log in</a>
				<span>or</span>
				<a href="/register">Register</a>
			</menu>
		`;
	}

	private isAuthenticated(): boolean {
		const account_key = this.getAccountKey();

		return account_key !== SystemKey.ANONYMOUS_ACCOUNT;
	}

	private getAccountKey(): string {
		const account = this.getAccount();

		return account.key;
	}

	private getAccountUrl(): string {
		const account = this.getAccount();

		return this.buildNodeUrl(account);
	}

	private getAccount(): Node {
		const input = this.getInput();

		return input.account;
	}
}

export default AccountMenuTemplate;
