import Node from 'type/node';
import SystemKey from 'system/enum/key';
import PageTemplate, { Breadcrumb, PageTemplateInput } from 'template/page';

interface Input extends PageTemplateInput {
	readonly node: Node;
}

class TypeFormTemplate extends PageTemplate<Input> {
	protected getBreadcrumbs(): Breadcrumb[] {
		const type_key = this.getTypeKey();
		const type_url = this.getTypeUrl();

		return [
			{
				label: type_key,
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
		return this.buildUrl(
			SystemKey.GENERIC_TYPE,
			SystemKey.GENERIC_TYPE
		);
	}

	private getTypeKey(): string {
		const node = this.getNode();

		return node.type_key;
	}

	private getNode(): Node {
		const input = this.getInput();

		return input.node;
	}
}

export default TypeFormTemplate;
