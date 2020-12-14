import Node from 'type/node';
import SystemKey from 'system/enum/key';
import PageTemplate, { Breadcrumb, PageTemplateInput } from 'template/page';

interface Input extends PageTemplateInput {
	readonly node: Node;
}

class TypeFormTemplate extends PageTemplate<Input> {
	protected getBreadcrumbs(): Breadcrumb[] {
		const namespace_key = this.getNamespaceKey();
		const namespace_url = this.getNamespaceUrl();
		const type_key = this.getTypeKey();
		const type_url = this.getTypeUrl();

		return [
			{
				label: namespace_key,
				url: namespace_url
			},
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

	private getNamespaceUrl(): string {
		const namespace_key = this.getNamespaceKey();

		return this.buildUrl(
			SystemKey.SYSTEM_NAMESPACE,
			SystemKey.NAMESPACE_TYPE,
			namespace_key
		);
	}

	private getNamespaceKey(): string {
		const node = this.getNode();

		return node.namespace_key;
	}

	private getTypeUrl(): string {
		const namespace_key = this.getNamespaceKey();

		return this.buildUrl(
			namespace_key,
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
