import FieldInput from 'template/page/instance-details/type/field-input';
import ActionType from 'enum/action-type';
import InstanceNode from 'type/instance-node';
import PermissionNode from 'type/node/permission';
import getNodeParameters from 'utility/get-node-parameters';
import FieldTableTemplate from 'template/page/instance-details/field-table';
import PermissionsTableTemplate from 'template/partial/permissions-table';
import PageTemplate, { Breadcrumb, PageTemplateInput } from 'template/page';

interface Input extends PageTemplateInput {
	readonly instance: InstanceNode;
	readonly fields: FieldInput[];
	readonly permissions: PermissionNode[];
	readonly available_action_types: ActionType[];
}

class InstanceDetailsTemplate extends PageTemplate<Input> {
	protected getBreadcrumbs(): Breadcrumb[] {
		const type_id = this.getTypeId();
		const type_url = this.getTypeUrl();
		const instance_id = this.getInstanceId();

		return [
			{
				label: type_id,
				url: type_url
			},
			{
				label: instance_id
			}
		];
	}

	protected getContentTitle(): string {
		return this.getInstanceId();
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

	private getFieldTableHtml(): string {
		const fields = this.getFields();

		const input = {
			fields
		};

		const template = new FieldTableTemplate(input);

		return template.render();
	}

	private getActionsHtml(): string {
		let serialized_actions: string[] = [];

		if (this.updateActionAvailable()) {
			const edit_action_html = this.getEditActionHtml();

			serialized_actions.push(edit_action_html);
		}

		if (serialized_actions.length === 0) {
			return '<em>No available actions.</em>';
		}

		const list_html = serialized_actions.join('\n');

		return `
			<ul>
				${list_html}
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

	private getEditActionHtml(): string {
		const edit_url = this.getEditUrl();

		return `
			<li>
				<a href="${edit_url}">Edit this instance</a>
			</li>
		`;
	}

	private getEditUrl(): string {
		const instance_url = this.getInstanceUrl();

		return `${instance_url}/edit`;
	}

	private getInstanceUrl(): string {
		const instance = this.getInstance();

		return instance.url;
	}

	private getTypeUrl(): string {
		const instance = this.getInstance();

		return instance.type;
	}

	private getTypeId(): string {
		const instance = this.getInstance();
		const parameters = getNodeParameters(instance.url);

		return parameters.type_id;
	}

	private getCreatorId(): string {
		const creator_url = this.getCreatorUrl();
		const parts = creator_url.split('/');

		return parts.pop() as string;
	}

	private getCreatorUrl(): string {
		const instance = this.getInstance();

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

	private serializeTimestamp(timestamp: number): string {
		const date = new Date(timestamp);

		return date.toString();
	}

	private getCreatedAt(): number {
		const instance = this.getInstance();

		return instance.created_at;
	}

	private getUpdatedAt(): number {
		const instance = this.getInstance();

		return instance.updated_at;
	}

	private getFields(): FieldInput[] {
		const input = this.getInput();

		return input.fields;
	}

	private getInstanceId(): string {
		const instance = this.getInstance();
		const parameters = getNodeParameters(instance.url);

		return parameters.id;
	}

	private getInstance(): InstanceNode {
		const input = this.getInput();

		return input.instance;
	}

	private getPermissions(): PermissionNode[] {
		const input = this.getInput();

		return input.permissions;
	}

	private updateActionAvailable(): boolean {
		const available_action_types = this.getAvailableActionTypes();

		return available_action_types.includes(ActionType.UPDATE);
	}

	private getAvailableActionTypes(): ActionType[] {
		const input = this.getInput();

		return input.available_action_types;
	}
}

export default InstanceDetailsTemplate;
