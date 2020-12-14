import PageTemplate, { Breadcrumb, PageTemplateInput } from 'template/page';

class LoginPageTemplate extends PageTemplate<PageTemplateInput> {
	protected getContentTitle(): string {
		return 'Logged out';
	}

	protected getBreadcrumbs(): Breadcrumb[] {
		return [
			{
				label: 'Home',
				url: '/'
			},
			{
				label: 'Logged out'
			}
		];
	}

	protected getContentHtml(): string {
		return `
			<p>You have been logged out.</p>
		`;
	}
}

export default LoginPageTemplate;
