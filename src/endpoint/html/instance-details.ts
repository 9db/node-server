import SystemId from 'system/enum/id';
import TypeNode from 'type/type-node';
import FieldInput from 'template/page/instance-details/type/field-input';
import HtmlEndpoint from 'endpoint/html';
import InstanceNode from 'type/instance-node';
import getFieldKeys from 'utility/get-field-keys';
import FetchNodeOperation from 'operation/fetch-node';
import InstanceDetailsTemplate from 'template/page/instance-details';

class HtmlInstanceDetailsEndpoint extends HtmlEndpoint<Record<string, never>> {
	protected async process(): Promise<string> {
		const node = await this.fetchNode();
		const type_node = await this.fetchTypeNode();

		return this.renderNode(node, type_node);
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

	private async fetchTypeNode(): Promise<TypeNode> {
		const id = this.getUrlParameter('type_id');
		const type_id = SystemId.GENERIC_TYPE;
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

		return node as TypeNode;
	}

	private async renderNode(node: InstanceNode, type_node: TypeNode): Promise<string> {
		const account = this.getAccount();
		const fields = await this.buildFieldInputs(node, type_node);

		const template = new InstanceDetailsTemplate({
			node,
			fields,
			account
		});

		return template.render();
	}

	private buildFieldInputs(node: InstanceNode, type_node: TypeNode): Promise<FieldInput[]> {
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
		const type_url = type_node[field_key] as string;

		if (type_url === undefined) {
			throw new Error(`Unable to find type url for instance key ${field_key}`);
		}

		// TODO: Remote types
		const parts = type_url.split('/');
		const type_id = parts.pop() as string;
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			id: type_id,
			type_id: SystemId.GENERIC_TYPE,
			repository,
			account
		};

		const operation = new FetchNodeOperation(input);
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
