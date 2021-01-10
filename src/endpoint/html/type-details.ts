import TypeNode from 'type/type-node';
import ActionType from 'enum/action-type';
import FieldInput from 'template/page/node-details/type/field-input';
import HtmlEndpoint from 'endpoint/html';
import getFieldKeys from 'utility/get-field-keys';
import PermissionNode from 'type/node/permission';
import TypeDetailsTemplate from 'template/page/type-details';
import FetchNodePermissionsOperation from 'operation/fetch-node-permissions';
import FetchAvailableActionTypesOperation from 'operation/fetch-available-action-types';

class HtmlTypeDetailsEndpoint extends HtmlEndpoint<Record<string, never>> {
	protected async process(): Promise<string> {
		const type_id = this.getUrlParameter('type_id');
		const type_node = await this.fetchType(type_id);
		const fields = await this.buildFieldInputs(type_node);
		const permissions = await this.fetchPermissions(type_node);
		const available_action_types = await this.fetchAvailableActionTypes(
			type_node
		);

		return this.renderNode(
			type_node,
			fields,
			permissions,
			available_action_types
		);
	}

	private buildFieldInputs(node: TypeNode): Promise<FieldInput[]> {
		const field_keys = getFieldKeys(node);

		const promises = field_keys.map((field_key) => {
			return this.buildFieldInputForKey(field_key, node);
		});

		return Promise.all(promises);
	}

	private async buildFieldInputForKey(
		field_key: string,
		node: TypeNode
	): Promise<FieldInput> {
		const url = node[field_key] as string;

		if (url === undefined) {
			throw new Error(`Unable to find type url for instance key ${field_key}`);
		}

		const field_type_node = await this.loadTypeFromUrl(url);

		return {
			key: field_key,
			value: null,
			type_node: field_type_node
		};
	}

	private fetchPermissions(node: TypeNode): Promise<PermissionNode[]> {
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

	private fetchAvailableActionTypes(node: TypeNode): Promise<ActionType[]> {
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			node,
			repository,
			account
		};

		const operation = new FetchAvailableActionTypesOperation(input);

		return operation.perform();
	}

	private renderNode(
		node: TypeNode,
		fields: FieldInput[],
		permissions: PermissionNode[],
		available_action_types: ActionType[]
	): string {
		const account = this.getAccount();

		const template = new TypeDetailsTemplate({
			node,
			fields,
			permissions,
			available_action_types,
			account
		});

		return template.render();
	}
}

export default HtmlTypeDetailsEndpoint;
