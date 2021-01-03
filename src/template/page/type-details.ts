import TypeNode from 'type/type-node';
import SystemId from 'system/enum/id';
import FieldInput from 'template/page/type-details/type/field-input';
import PermissionNode from 'type/node/permission';
import getNodeParameters from 'utility/get-node-parameters';
import FieldTableTemplate from 'template/page/type-details/field-table';
import PermissionsTableTemplate from 'template/partial/permissions-table';
import PageTemplate, { Breadcrumb, PageTemplateInput } from 'template/page';

interface Input extends PageTemplateInput {
	readonly node: TypeNode;
	readonly fields: FieldInput[];
	readonly permissions: PermissionNode[];
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
		const permissions_html = this.getPermissionsHtml();

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

			<section>
				<h3>Permissions:</h3>

				${permissions_html}
			</section>
		`;
	}

	private getFieldTableHtml(): string {
		const fields = this.getFields();

		const template = new FieldTableTemplate({
			fields
		});

		return template.render();
	}

	private getLinksHtml(): string {
		const edit_link_html = this.getEditLinkHtml();
		const instances_link_html = this.getInstancesLinkHtml();
		const child_types_link_html = this.getChildTypesLinkHtml();
		const new_link_html = this.getNewLinkHtml();

		return `
			<ul>
				${edit_link_html}
				${instances_link_html}
				${child_types_link_html}
				${new_link_html}
			</ul>
		`;
	}

	private getPermissionsHtml(): string {
		const permissions = this.getPermissions();

		const template = new PermissionsTableTemplate({
			permissions
		});

		return template.render();
	}

	private getEditLinkHtml(): string {
		const edit_url = this.getEditUrl();

		return `
			<li>
				<a href="${edit_url}">Edit this type</a>
			</li>
		`;
	}

	private getInstancesLinkHtml(): string {
		const instances_url = this.getInstancesUrl();
		const node_id = this.getNodeId();

		return `
			<li>
				<a href="${instances_url}">View list of ${node_id} instances</a>
			</li>
		`;
	}

	private getChildTypesLinkHtml(): string {
		const child_types_url = this.getChildTypesUrl();
		const node_id = this.getNodeId();

		return `
			<li>
				<a href="${child_types_url}">View list of ${node_id} child types</a>
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

	private getInstancesUrl(): string {
		const node_id = this.getNodeId();

		return `/${SystemId.GENERIC_TYPE}/${node_id}/instances`;
	}

	private getChildTypesUrl(): string {
		const node_id = this.getNodeId();

		return `/${SystemId.GENERIC_TYPE}/${node_id}/child_types`;
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

	private getPermissions(): PermissionNode[] {
		const input = this.getInput();

		return input.permissions;
	}
}

export default TypeDetailsTemplate;
