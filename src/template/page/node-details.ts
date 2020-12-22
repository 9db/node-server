import Node from 'type/node';
import SystemKey from 'system/enum/key';
import PageTemplate, { Breadcrumb, PageTemplateInput } from 'template/page';

interface Input extends PageTemplateInput {
	readonly node: Node;
	readonly type_nodes: Node[];
}

class NodeDetailsTemplate extends PageTemplate<Input> {
	protected getBreadcrumbs(): Breadcrumb[] {
		const type_key = this.getTypeKey();
		const type_url = this.getTypeUrl();
		const node_key = this.getNodeKey();

		return [
			{
				label: type_key,
				url: type_url
			},
			{
				label: node_key
			}
		];
	}

	protected getContentTitle(): string {
		return this.getNodeKey();
	}

	protected getContentHtml(): string {
		const creator_url = this.getCreatorUrl();
		const creator_key = this.getCreatorKey();
		const created_at = this.serializeCreatedAt();
		const updated_at = this.serializeUpdatedAt();
		const field_table_html = this.getFieldTableHtml();
		const links_html = this.getLinksHtml();

		return `
			<section>
				<small>
					<p>
						Created by
						<a href="${creator_url}">${creator_key}</a>
						on <time>${created_at}</time>.
					</p>
					<p>
						Last modified on <time>${updated_at}</time>.
					</p>
				</small>
			</section>

			<section>
				<h3>Fields:</h3>

				${field_table_html}
			</section>

			<section>
				<h3>Links:</h3>

				${links_html}
			</section>
		`;
	}

	private getFieldTableHtml(): string {
		/*
		const node = this.getNode();
		const type_nodes = this.getTypeNodes();
		const serializer = new NodeDetailsFieldTableSerializer(node, type_nodes);

		return serializer.serialize();
		*/

		return 'field table';
	}

	private getLinksHtml(): string {
		const list_link_html = this.getListLinkHtml();
		const edit_link_html = this.getEditLinkHtml();
		const new_link_html = this.getNewLinkHtml();

		return `
			<ul>
				${edit_link_html}
				${list_link_html}
				${new_link_html}
			</ul>
		`;
	}

	private getEditLinkHtml(): string {
		const edit_url = this.getEditUrl();
		const node_type = this.getNodeType();

		return `
			<li>
				<a href="${edit_url}">Edit this ${node_type}</a>
			</li>
		`;
	}

	private getListLinkHtml(): string {
		if (this.isInstanceNode()) {
			return '';
		}

		const list_url = this.getListUrl();
		const node_key = this.getNodeKey();

		return `
			<li>
				<a href="${list_url}">View list of ${node_key} instances</a>
			</li>
		`;
	}

	private getNewLinkHtml(): string {
		if (this.isInstanceNode()) {
			return '';
		}

		const new_url = this.getNewUrl();
		const node_key = this.getNodeKey();

		return `
			<li>
				<a href="${new_url}">Create new ${node_key} instance</a>
			</li>
		`;
	}

	private getEditUrl(): string {
		const node_url = this.getNodeUrl();

		return `${node_url}/edit`;
	}

	private getListUrl(): string {
		const node_key = this.getNodeKey();

		return this.buildUrl(node_key, 'list');
	}

	private getNewUrl(): string {
		const node_key = this.getNodeKey();

		return this.buildUrl(node_key, 'new');
	}

	private getNodeUrl(): string {
		const type_key = this.getTypeKey();
		const node_key = this.getNodeKey();

		return this.buildUrl(type_key, node_key);
	}

	private isInstanceNode(): boolean {
		return !this.isTypeNode();
	}

	private isTypeNode(): boolean {
		const type_key = this.getTypeKey();

		return type_key === SystemKey.GENERIC_TYPE;
	}

	private getTypeUrl(): string {
		const type_key = this.getTypeKey();

		return this.buildUrl(SystemKey.GENERIC_TYPE, type_key);
	}

	private getTypeKey(): string {
		const node = this.getNode();

		return node.type_key;
	}

	private getCreatorKey(): string {
		const creator_url = this.getCreatorUrl();
		const parts = creator_url.split('/');

		return parts.pop() as string;
	}

	private getCreatorUrl(): string {
		const node = this.getNode();

		return node.creator;
	}

	private serializeCreatedAt(): string {
		const created_at = this.getCreatedAt();

		return this.serializeTimestamp(created_at);
	}

	private serializeUpdatedAt(): string {
		const updated_at = this.getUpdatedAt();

		return this.serializeTimestamp(updated_at);
	}

	private serializeTimestamp(timestamp: number): string {
		const date = new Date(timestamp);

		return date.toString();
	}

	private getCreatedAt(): number {
		const node = this.getNode();

		return node.created_at;
	}

	private getUpdatedAt(): number {
		const node = this.getNode();

		return node.updated_at;
	}

	private getNodeKey(): string {
		const node = this.getNode();

		return node.key;
	}

	private getNodeType(): string {
		if (this.isTypeNode()) {
			return 'type';
		} else {
			return 'instance';
		}
	}

	private getNode(): Node {
		const input = this.getInput();

		return input.node;
	}
}

export default NodeDetailsTemplate;
