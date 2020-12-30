import TypeNode from 'type/type-node';
import FieldValue from 'type/field-value';
import FieldInput from 'template/page/instance-details/type/field-input';
import HtmlEndpoint from 'endpoint/html';
import InstanceNode from 'type/instance-node';
import getFieldKeys from 'utility/get-field-keys';
import ListDetailsTemplate from 'template/page/list-details';
import InstanceDetailsTemplate from 'template/page/instance-details';

class HtmlInstanceDetailsEndpoint extends HtmlEndpoint<Record<string, never>> {
	protected async process(): Promise<string> {
		if (this.isListNode()) {
			return this.renderList();
		}

		const type_id = this.getTypeId();
		const id = this.getNodeId();
		const node = await this.fetchInstance(type_id, id);
		const type_node = await this.loadTypeNodeFromUrl(node.type);
		const fields = await this.buildFieldInputs(node, type_node);

		return this.renderNode(node, type_node, fields);
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

		const field_type_node = await this.loadTypeNodeFromUrl(url);

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
		const type_id = this.getTypeId();

		return /-(list|set)$/.test(type_id);
	}

	private fetchListType(): Promise<TypeNode> {
		const type_id = this.getTypeId();
		const match = type_id.match(/^(.*)-(list|set)$/);

		if (match === null) {
			throw new Error(`Unable to fetch list type from type id: ${type_id}`);
		}

		const inner_type_id = match[1] as string;

		return this.fetchType(inner_type_id);
	}

	private fetchListValues(): Promise<FieldValue[]> {
		return Promise.resolve([]);
	}

	private getNodeId(): string {
		return this.getUrlParameter('id');
	}

	private getTypeId(): string {
		return this.getUrlParameter('type_id');
	}
}

export default HtmlInstanceDetailsEndpoint;
