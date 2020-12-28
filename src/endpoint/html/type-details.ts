import TypeNode from 'type/type-node';
import SystemId from 'system/enum/id';
import FieldInput from 'template/page/type-details/type/field-input';
import HtmlEndpoint from 'endpoint/html';
import getFieldKeys from 'utility/get-field-keys';
import FetchNodeOperation from 'operation/fetch-node';
import TypeDetailsTemplate from 'template/page/type-details';
import LoadNodeFromUrlOperation from 'operation/load-node-from-url';

class HtmlTypeDetailsEndpoint extends HtmlEndpoint<Record<string, never>> {
	protected async process(): Promise<string> {
		const node = await this.fetchNode();
		const fields = await this.buildFieldInputs(node);

		return this.renderNode(node, fields);
	}

	private async fetchNode(): Promise<TypeNode> {
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
			type_node: field_type_node
		};
	}

	private renderNode(node: TypeNode, fields: FieldInput[]): string {
		const account = this.getAccount();

		const template = new TypeDetailsTemplate({
			node,
			fields,
			account
		});

		return template.render();
	}
}

export default HtmlTypeDetailsEndpoint;
