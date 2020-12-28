import TypeNode from 'type/type-node';
import FieldInput from 'template/page/instance-details/type/field-input';
import HtmlEndpoint from 'endpoint/html';
import InstanceNode from 'type/instance-node';
import getFieldKeys from 'utility/get-field-keys';
import FetchNodeOperation from 'operation/fetch-node';
import InstanceDetailsTemplate from 'template/page/instance-details';
import LoadNodeFromUrlOperation from 'operation/load-node-from-url';

class HtmlInstanceDetailsEndpoint extends HtmlEndpoint<Record<string, never>> {
	protected async process(): Promise<string> {
		const node = await this.fetchNode();
		const type_node = await this.fetchTypeNode(node);
		const fields = await this.buildFieldInputs(node, type_node);

		return this.renderNode(node, type_node, fields);
	}

	private async fetchNode(): Promise<InstanceNode> {
		const id = this.getUrlParameter('id');
		const type_id = this.getUrlParameter('type_id');
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			id,
			type_id,
			repository,
			account
		};

		const operation = new FetchNodeOperation(input);
		const node = await operation.perform();

		return node as InstanceNode;
	}

	private async fetchTypeNode(instance_node: InstanceNode): Promise<TypeNode> {
		const repository = this.getRepository();
		const account = this.getAccount();
		const url = instance_node.type;

		const input = {
			url,
			repository,
			account
		};

		const operation = new LoadNodeFromUrlOperation(input);
		const node = await operation.perform();

		return node as TypeNode;
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

		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			url,
			repository,
			account
		};

		const operation = new LoadNodeFromUrlOperation(input);
		const result = await operation.perform();
		const field_type_node = result as TypeNode;

		return {
			key: field_key,
			value,
			type_node: field_type_node
		};
	}
}

export default HtmlInstanceDetailsEndpoint;
