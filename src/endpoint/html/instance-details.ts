import TypeNode from 'type/type-node';
import SystemId from 'system/enum/id';
import ActionType from 'enum/action-type';
import FieldInput from 'template/page/instance-details/type/field-input';
import HtmlEndpoint from 'endpoint/html';
import InstanceNode from 'type/instance-node';
import getFieldKeys from 'utility/get-field-keys';
import PermissionNode from 'type/node/permission';
import InstanceDetailsTemplate from 'template/page/instance-details';
import FetchNodePermissionsOperation from 'operation/fetch-node-permissions';

class HtmlInstanceDetailsEndpoint extends HtmlEndpoint<Record<string, never>> {
	protected async process(): Promise<string | void> {
		if (this.isTypeNode()) {
			return this.redirectToTypeUrl();
		}

		const type_id = this.getTypeId();
		const instance_id = this.getInstanceId();
		const instance = await this.fetchInstance(type_id, instance_id);
		const type_node = await this.loadTypeFromUrl(instance.type);
		const fields = await this.buildFieldInputs(instance, type_node);
		const permissions = await this.fetchPermissions(instance);
		const available_action_types = await this.fetchAvailableActionTypes(instance);

		return this.renderInstance(
			instance,
			type_node,
			fields,
			permissions,
			available_action_types
		);
	}

	private redirectToTypeUrl(): Promise<void> {
		const instance_id = this.getInstanceId();
		const url = `/${instance_id}`;

		this.redirectToUrl(url);

		return Promise.resolve();
	}

	private async renderInstance(
		instance: InstanceNode,
		_type_node: TypeNode,
		fields: FieldInput[],
		permissions: PermissionNode[],
		available_action_types: ActionType[]
	): Promise<string> {
		const account = this.getAccount();

		const template = new InstanceDetailsTemplate({
			instance,
			fields,
			permissions,
			available_action_types,
			account
		});

		return template.render();
	}

	private buildFieldInputs(
		node: InstanceNode,
		type_node: TypeNode
	): Promise<FieldInput[]> {
		const field_keys = getFieldKeys(node);

		const promises = field_keys.map((field_key) => {
			return this.buildFieldInputForKey(field_key, node, type_node);
		});

		return Promise.all(promises);
	}

	private async buildFieldInputForKey(
		field_key: string,
		node: InstanceNode,
		type_node: TypeNode
	): Promise<FieldInput> {
		const value = node[field_key];
		const url = type_node[field_key] as string;

		if (url === undefined) {
			throw new Error(`Unable to find type url for instance key ${field_key}`);
		}

		const field_type_node = await this.loadTypeFromUrl(url);

		return {
			key: field_key,
			value,
			type_node: field_type_node
		};
	}

	private fetchPermissions(node: InstanceNode): Promise<PermissionNode[]> {
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			node,
			repository,
			account
		};

		const operation = new FetchNodePermissionsOperation(input);

		return operation.perform();
	}

	private fetchAvailableActionTypes(instance: InstanceNode): Promise<ActionType[]> {
		return Promise.resolve([]);
	}

	private isTypeNode(): boolean {
		const type_id = this.getTypeId();

		return type_id === SystemId.GENERIC_TYPE;
	}

	private getInstanceId(): string {
		return this.getUrlParameter('instance_id');
	}

	private getTypeId(): string {
		return this.getUrlParameter('type_id');
	}
}

export default HtmlInstanceDetailsEndpoint;
