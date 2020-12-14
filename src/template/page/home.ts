import PageTemplate, { Breadcrumb, PageTemplateInput } from 'template/page';

class HomePageTemplate extends PageTemplate<PageTemplateInput> {
	protected getContentTitle(): string {
		return 'Home';
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
			<p>Temporary home page.</p>
		`;
	}
}

export default HomePageTemplate;
