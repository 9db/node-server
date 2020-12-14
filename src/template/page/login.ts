import PageTemplate, { Breadcrumb, PageTemplateInput } from 'template/page';

class LoginPageTemplate extends PageTemplate<PageTemplateInput> {
	protected getContentTitle(): string {
		return 'Log in';
	}

	protected getBreadcrumbs(): Breadcrumb[] {
		return [
			{
				label: 'Home',
				url: '/'
			},
			{
				label: 'Log in'
			}
		];
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
