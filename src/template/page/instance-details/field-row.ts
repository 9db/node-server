import Node from 'type/node';
import Template from 'template';
import FieldValue from 'type/field-value';
import FieldInput from 'template/page/instance-details/type/field-input';
import getNodeParameters from 'utility/get-node-parameters';

class FieldRowTemplate extends Template<FieldInput> {
	protected getHtml(): string {
		const key_html = this.getKeyHtml();
		const type_html = this.getTypeHtml();
		const value_html = this.getValueHtml();

		return `
			<tr>
				<td>
					${key_html}
				</td>
				<td>
					${type_html}
				</td>
				<td>
					${value_html}
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

	private getValueHtml(): string {
		const value = this.getValue();

		if (value === null) {
			return 'null';
		}

		return value.toString();
	}

	private getValue(): FieldValue {
		const input = this.getInput();

		return input.value;
	}

	private getTypeUrl(): string {
		const type_node = this.getTypeNode();

		return type_node.url;
	}

	private getTypeId(): string {
		const type_node = this.getTypeNode();
		const parameters = getNodeParameters(type_node);

		return parameters.id;
	}

	private getTypeNode(): Node {
		const input = this.getInput();

		return input.type_node;
	}
}

export default FieldRowTemplate;
