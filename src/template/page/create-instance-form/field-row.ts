import Template from 'template';
import TypeNode from 'type/type-node';
import FieldInput from 'template/page/create-instance-form/type/field-input';
import InstanceNode from 'type/instance-node';
import getNodeParameters from 'utility/get-node-parameters';

interface Input extends FieldInput {
	readonly index: number;
}

class FieldRowTemplate extends Template<Input> {
	protected getHtml(): string {
		const key_html = this.getKeyHtml();
		const type_html = this.getTypeHtml();
		const instance_list_html = this.getInstanceListHtml();
		const explicit_value_html = this.getExplicitValueHtml();

		return `
			<tr>
				<td>
					${key_html}
				</td>
				<td>
					${type_html}
				</td>
				<td>
					${instance_list_html}
				</td>
				<td>
					${explicit_value_html}
				</td>
			</tr>
		`;
	}

	private getKeyHtml(): string {
		const index = this.getIndex();
		const field_key = this.getFieldKey();

		return `
			<input name="fields[${index}][key]" type="hidden" value="${field_key}" />
			<input value="${field_key}" disabled />
		`;
	}

	private getTypeHtml(): string {
		const index = this.getIndex();
		const type_url = this.getTypeUrl();
		const type_label = this.getTypeLabel();

		return `
			<input name="fields[${index}][type_url]" type="hidden" value="${type_url}" />
			<a href="${type_url}">${type_label}</a>
		`;
	}

	private getInstanceListHtml(): string {
		if (!this.hasInstanceList()) {
			return '<em>N/A</em>';
		}

		const index = this.getIndex();
		const instance_options_html = this.getInstanceOptionsHtml();

		return `
			<select name="fields[${index}][value]">
				${instance_options_html}
			</select>
		`;
	}

	private getInstanceOptionsHtml(): string {
		const field_instance_list = this.getInstanceList();

		const serialized_options: string[] = [
			`
				<option disabled selected value>
					Select an existing instance
				</option>
			`
		];

		field_instance_list.forEach((instance) => {
			const url = instance.url;
			const parameters = getNodeParameters(url);
			const id = parameters.id;

			serialized_options.push(`
				<option value="${url}">${id}</option>
			`);
		});

		return serialized_options.join('\n');
	}

	private getExplicitValueHtml(): string {
		const index = this.getIndex();

		return `
			<input name="fields[${index}][value]" />
		`;
	}

	private getFieldKey(): string {
		const input = this.getInput();

		return input.key;
	}

	private getTypeUrl(): string {
		const type_node = this.getTypeNode();

		return type_node.url;
	}

	private getTypeLabel(): string {
		const type_node = this.getTypeNode();
		const parameters = getNodeParameters(type_node.url);

		return parameters.id;
	}

	private getIndex(): number {
		const input = this.getInput();

		return input.index;
	}

	private getTypeNode(): TypeNode {
		const input = this.getInput();

		return input.type_node;
	}

	private hasInstanceList(): boolean {
		const input = this.getInput();

		if (input.instance_list === undefined) {
			return false;
		}

		return input.instance_list.length > 0;
	}

	private getInstanceList(): InstanceNode[] {
		const input = this.getInput();

		if (input.instance_list === undefined) {
			throw new Error('Tried to read instance list, but it was not set');
		}

		return input.instance_list;
	}
}

export default FieldRowTemplate;
