import Node from 'type/node';
import SystemId from 'system/enum/id';
import PageTemplate, { Breadcrumb, PageTemplateInput } from 'template/page';

interface Input extends PageTemplateInput {
	readonly node: Node;
}

class TypeFormTemplate extends PageTemplate<Input> {
	protected getBreadcrumbs(): Breadcrumb[] {
		const type_id = this.getTypeId();
		const type_url = this.getTypeUrl();

		return [
			{
				label: type_id,
				url: type_url
			},
			{
				label: 'new'
			}
		];
	}

	protected getContentTitle(): string {
		return 'Create new type';
	}

	protected getContentHtml(): string {
		return `
			form goes here
		`;
	}

	private getTypeUrl(): string {
		return this.buildUrl(SystemId.GENERIC_TYPE, SystemId.GENERIC_TYPE);
	}

	private getTypeId(): string {
		const node = this.getNode();

		return node.type_id;
	}

	private getNode(): Node {
		const input = this.getInput();

		return input.node;
	}
}

export default TypeFormTemplate;
