import PageTemplate from 'template/page';

class LoginPageTemplate extends PageTemplate {
	protected getContentTitle(): string {
		return 'Log in';
	}

	protected getHeaderHtml(): string {
		return 'xxx';
	}

	protected getContentHtml(): string {
		return `
			<form action="/session" method="POST">
				<fieldset>
					<label for="username">Username</label>
					<input type="text" name="username" />
				</fieldset>

				<fieldset>
					<label for="password">Password</label>
					<input type="password" name="password" />
				</fieldset>

				<button type="submit">Log in</button>
			</form>
		`;
	}
}

export default LoginPageTemplate;
