import Node from 'type/node';
import SystemId from 'system/enum/id';
import ActionType from 'enum/action-type';
import FieldInput from 'template/page/node-details/type/field-input';
import PermissionNode from 'type/node/permission';
import getNodeParameters from 'utility/get-node-parameters';
import PermissionsTableTemplate from 'template/page/node-details/permissions-table';
import PageTemplate, { Breadcrumb, PageTemplateInput } from 'template/page';

interface Input extends PageTemplateInput {
	readonly node: Node;
	readonly fields: FieldInput[];
	readonly permissions: PermissionNode[];
	readonly available_action_types: ActionType[];
}

abstract class NodeDetailsTemplate extends PageTemplate<Input> {
	protected getContentTitle(): string {
		return this.getNodeId();
	}

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

	protected getContentHtml(): string {
		const creator_url = this.getCreatorUrl();
		const creator_id = this.getCreatorId();
		const created_at = this.serializeCreatedAt();
		const updated_at = this.serializeUpdatedAt();
		const field_table_html = this.getFieldTableHtml();
		const actions_html = this.getActionsHtml();
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
				<h3>Actions:</h3>

				${actions_html}
			</section>

			<section>
				<h3>Permissions:</h3>

				${permissions_html}
			</section>
		`;
	}

	protected getNode(): Node {
		const input = this.getInput();

		return input.node;
	}

	protected getFields(): FieldInput[] {
		const input = this.getInput();

		return input.fields;
	}

	private getActionsHtml(): string {
		const serialized_actions: string[] = [];

		if (this.updateActionAvailable()) {
			const edit_action_html = this.getEditActionHtml();

			serialized_actions.push(edit_action_html);
		}

		if (this.createActionAvailable()) {
			const create_action_html = this.getCreateActionHtml();

			serialized_actions.push(create_action_html);
		}

		if (serialized_actions.length === 0) {
			return this.getNoAvailableActionsHtml();
		}

		const list_html = serialized_actions.join('\n');

		return `
			<ul>
				${list_html}
			</ul>
		`;
	}

	private getNoAvailableActionsHtml(): string {
		if (this.isLoggedIn()) {
			return '<em>No available actions.</em>';
		}

		return `
			<em>
				No available actions.
				Do you need to <a href="/login">log in</a>?
			</em>
		`;
	}

	private getPermissionsHtml(): string {
		const permissions = this.getPermissions();

		const template = new PermissionsTableTemplate({
			permissions
		});

		return template.render();
	}

	private getEditActionHtml(): string {
		const edit_url = this.getEditUrl();
		const node_label = this.getNodeLabel();

		return `
			<li>
				<a href="${edit_url}">Edit this ${node_label}</a>
			</li>
		`;
	}

	private getCreateActionHtml(): string {
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

	private getNewUrl(): string {
		const node_id = this.getNodeId();

		if (node_id === SystemId.GENERIC_TYPE) {
			return '/create-type';
		} else {
			return `/create-instance?type_id=${node_id}`;
		}
	}

	private getCreatorId(): string {
		const creator_url = this.getCreatorUrl();
		const parts = creator_url.split('/');

		return parts.pop() as string;
	}

	private getCreatorUrl(): string {
		const instance = this.getNode();

		return instance.creator;
	}

	private serializeCreatedAt(): string {
		const created_at = this.getCreatedAt();

		return this.serializeTimestamp(created_at);
	}

	private serializeUpdatedAt(): string {
		const updated_at = this.getUpdatedAt();

		return this.serializeTimestamp(updated_at);
	}

	private getCreatedAt(): number {
		const instance = this.getNode();

		return instance.created_at;
	}

	private getUpdatedAt(): number {
		const instance = this.getNode();

		return instance.updated_at;
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

	private getNodeId(): string {
		const node = this.getNode();
		const parameters = getNodeParameters(node.url);

		return parameters.id;
	}

	private getPermissions(): PermissionNode[] {
		const input = this.getInput();

		return input.permissions;
	}

	private updateActionAvailable(): boolean {
		const action_types = this.getAvailableActionTypes();

		return action_types.includes(ActionType.UPDATE);
	}

	private createActionAvailable(): boolean {
		const action_types = this.getAvailableActionTypes();

		return action_types.includes(ActionType.CREATE);
	}

	private isLoggedIn(): boolean {
		const account = this.getAccount();
		const parameters = getNodeParameters(account.url);
		const account_id = parameters.id;

		return account_id !== SystemId.ANONYMOUS_ACCOUNT;
	}

	private serializeTimestamp(timestamp: number): string {
		const date = new Date(timestamp);

		return date.toString();
	}

	private getAvailableActionTypes(): ActionType[] {
		const input = this.getInput();

		return input.available_action_types;
	}

	protected abstract getFieldTableHtml(): string;
	protected abstract getNodeLabel(): string;
}

export default NodeDetailsTemplate;
