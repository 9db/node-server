import PageTemplate, { Breadcrumb, PageTemplateInput } from 'template/page';

interface Input extends PageTemplateInput {}

class HomePageTemplate extends PageTemplate<Input> {
	protected getContentTitle(): string {
		return '9DB dev server';
	}

	protected getBreadcrumbs(): Breadcrumb[] {
		return [
			{
				label: 'Home'
			}
		];
	}

	protected getContentHtml(): string {
		return `
			<p>
				This is a development server that I'm using for testing out my new 9DB
				database and API specification. You can view a list of the ongoing
				issues that I'm tackling as part of this work
				<a href="/type/issue/instances">here</a>.
			</p>
		`;
	}
}

export default HomePageTemplate;
