import Template from 'template';
import TypeNode from 'type/type-node';
import FieldValue from 'type/field-value';
import FieldInput from 'template/page/node-details/type/field-input';
import getNodeParameters from 'utility/get-node-parameters';
import FieldValueTemplate from 'template/partial/field-value';

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

		const template = new FieldValueTemplate({
			value
		});

		return template.render();
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
		const parameters = getNodeParameters(type_node.url);

		return parameters.id;
	}

	private getTypeNode(): TypeNode {
		const input = this.getInput();

		return input.type_node;
	}
}

export default FieldRowTemplate;
