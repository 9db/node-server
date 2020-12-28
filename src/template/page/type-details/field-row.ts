import Template from 'template';
import TypeNode from 'type/type-node';
import FieldInput from 'template/page/type-details/type/field-input';
import getNodeParameters from 'utility/get-node-parameters';

class FieldRowTemplate extends Template<FieldInput> {
	protected getHtml(): string {
		const key_html = this.getKeyHtml();
		const type_html = this.getTypeHtml();

		return `
			<tr>
				<td>
					${key_html}
				</td>
				<td>
					${type_html}
				</td>
			</tr>
		`;
	}

	private getKeyHtml(): string {
		const input = this.getInput();

		return input.key;
	}

	private getTypeHtml(): string {
		const url = this.getTypeUrl();
		const id = this.getTypeId();

		return `<a href="${url}">${id}</a>`;
	}

	private getTypeUrl(): string {
		const type_node = this.getTypeNode();

		return type_node.url;
	}

	private getTypeId(): string {
		const type_node = this.getTypeNode();
		const parameters = getNodeParameters(type_node.url);

		return parameters.id;
	}

	private getTypeNode(): TypeNode {
		const input = this.getInput();

		return input.type_node;
	}
}

export default FieldRowTemplate;
