import TypeNode from 'type/type-node';
import FieldInput from 'template/page/type-details/type/field-input';
import HtmlEndpoint from 'endpoint/html';
import getFieldKeys from 'utility/get-field-keys';
import TypeDetailsTemplate from 'template/page/type-details';

class HtmlTypeDetailsEndpoint extends HtmlEndpoint<Record<string, never>> {
	protected async process(): Promise<string> {
		const type_id = this.getUrlParameter('type_id');
		const node = await this.fetchType(type_id);
		const fields = await this.buildFieldInputs(node);

		return this.renderNode(node, fields);
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

		const field_type_node = await this.loadTypeNodeFromUrl(url);

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
