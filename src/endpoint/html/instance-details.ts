import TypeNode from 'type/type-node';
import SystemId from 'system/enum/id';
import FieldValue from 'type/field-value';
import FieldInput from 'template/page/instance-details/type/field-input';
import HtmlEndpoint from 'endpoint/html';
import InstanceNode from 'type/instance-node';
import getFieldKeys from 'utility/get-field-keys';
import getListInnerType from 'utility/get-list-inner-type';
import ListDetailsTemplate from 'template/page/list-details';
import InstanceDetailsTemplate from 'template/page/instance-details';

class HtmlInstanceDetailsEndpoint extends HtmlEndpoint<Record<string, never>> {
	protected async process(): Promise<string | void> {
		if (this.isTypeNode()) {
			return this.redirectToTypeUrl();
		}

		if (this.isListNode()) {
			return this.renderList();
		}

		const type_id = this.getTypeId();
		const instance_id = this.getInstanceId();
		const instance_node = await this.fetchInstance(type_id, instance_id);
		const type_node = await this.loadTypeFromUrl(instance_node.type);
		const fields = await this.buildFieldInputs(instance_node, type_node);

		return this.renderNode(instance_node, type_node, fields);
	}

	private redirectToTypeUrl(): Promise<void> {
		const instance_id = this.getInstanceId();
		const url = `/${instance_id}`;

		this.redirectToUrl(url);

		return Promise.resolve();
	}

	private async renderNode(
		node: InstanceNode,
		type_node: TypeNode,
		fields: FieldInput[]
	): Promise<string> {
		const account = this.getAccount();

		const template = new InstanceDetailsTemplate({
			node,
			fields,
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

	private async renderList(): Promise<string> {
		const account = this.getAccount();
		const type_node = await this.fetchListType();
		const values = await this.fetchListValues();

		const input = {
			type_node,
			values,
			account
		};

		const template = new ListDetailsTemplate(input);

		return template.render();
	}

	private isListNode(): boolean {
		const inner_type_id = this.getListInnerType();

		return inner_type_id !== null;
	}

	private isTypeNode(): boolean {
		const type_id = this.getTypeId();

		return type_id === SystemId.GENERIC_TYPE;
	}

	private fetchListType(): Promise<TypeNode> {
		const inner_type_id = this.getListInnerType();

		if (inner_type_id === null) {
			const type_id = this.getTypeId();

			throw new Error(`Unable to fetch list type from type id: ${type_id}`);
		}

		return this.fetchType(inner_type_id);
	}

	private getListInnerType(): string | null {
		const type_id = this.getTypeId();

		return getListInnerType(type_id);
	}

	private fetchListValues(): Promise<FieldValue[]> {
		return Promise.resolve([]);
	}

	private getInstanceId(): string {
		return this.getUrlParameter('instance_id');
	}

	private getTypeId(): string {
		return this.getUrlParameter('type_id');
	}
}

export default HtmlInstanceDetailsEndpoint;
