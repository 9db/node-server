import TypeNode from 'type/type-node';
import FieldInput from 'template/page/type-details/type/field-input';
import getNodeParameters from 'utility/get-node-parameters';
import FieldTableTemplate from 'template/page/type-details/field-table';
import PageTemplate, { Breadcrumb, PageTemplateInput } from 'template/page';

interface Input extends PageTemplateInput {
	readonly node: TypeNode;
	readonly fields: FieldInput[];
}

class TypeDetailsTemplate extends PageTemplate<Input> {
	protected getBreadcrumbs(): Breadcrumb[] {
		const type_id = this.getTypeId();
		const type_url = this.getTypeUrl();
		const node_id = this.getNodeId();

		return [
			{
				label: type_id,
				url: type_url
			},
			{
				label: node_id
			}
		];
	}

	protected getContentTitle(): string {
		return this.getNodeId();
	}

	protected getContentHtml(): string {
		const creator_url = this.getCreatorUrl();
		const creator_id = this.getCreatorId();
		const created_at = this.serializeCreatedAt();
		const updated_at = this.serializeUpdatedAt();
		const field_table_html = this.getFieldTableHtml();
		const links_html = this.getLinksHtml();

		return `
			<section>
				<small>
					<p>
						Created by
						<a href="${creator_url}">${creator_id}</a>
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
		const fields = this.getFields();

		const input = {
			fields
		};

		const template = new FieldTableTemplate(input);

		return template.render();
	}

	private getLinksHtml(): string {
		const edit_link_html = this.getEditLinkHtml();
		const list_link_html = this.getListLinkHtml();
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

		return `
			<li>
				<a href="${edit_url}">Edit this type</a>
			</li>
		`;
	}

	private getListLinkHtml(): string {
		const list_url = this.getListUrl();
		const node_id = this.getNodeId();

		return `
			<li>
				<a href="${list_url}">View list of ${node_id} instances</a>
			</li>
		`;
	}

	private getNewLinkHtml(): string {
		const new_url = this.getNewUrl();
		const node_id = this.getNodeId();

		return `
			<li>
				<a href="${new_url}">Create new ${node_id} instance</a>
			</li>
		`;
	}

	private getEditUrl(): string {
		const node_url = this.getNodeUrl();

		return `${node_url}/edit`;
	}

	private getListUrl(): string {
		const node_url = this.getNodeUrl();

		return `${node_url}/list`;
	}

	private getNewUrl(): string {
		const node_url = this.getNodeUrl();

		return `${node_url}/new`;
	}

	private getNodeUrl(): string {
		const node = this.getNode();

		return node.url;
	}

	private getTypeUrl(): string {
		const node = this.getNode();

		return node.type;
	}

	private getTypeId(): string {
		const node = this.getNode();
		const parameters = getNodeParameters(node.url);

		return parameters.type_id;
	}

	private getCreatorId(): string {
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

	private getNodeId(): string {
		const node = this.getNode();
		const parameters = getNodeParameters(node.url);

		return parameters.id;
	}

	private getNode(): TypeNode {
		const input = this.getInput();

		return input.node;
	}

	private getFields(): FieldInput[] {
		const input = this.getInput();

		return input.fields;
	}
}

export default TypeDetailsTemplate;
