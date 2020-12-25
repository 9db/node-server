import Node from 'type/node';
import Template from 'template';

interface Input {
	readonly field_key: string;
	readonly field_index: number;
	readonly field_type_node: Node;
	readonly field_instance_list: Node[] | undefined;
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
		const type_url = this.getFieldTypeUrl();
		const type_label = this.getFieldTypeLabel();

		return `
			<input name="fields[${index}][type_url]" type="hidden" value="${type_url}" />
			<a href="${type_url}">${type_label}</a>
		`;
	}

	private getInstanceListHtml(): string {
		if (!this.hasFieldInstanceList()) {
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
		const field_instance_list = this.getFieldInstanceList();

		const serialized_options: string[] = [
			`
				<option disabled selected value>
					Select an existing instance
				</option>
			`
		];

		field_instance_list.forEach((instance) => {
			const url = instance.url;
			const label = instance.label;

			serialized_options.push(`
				<option value="${url}">${label}</option>
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

		return input.field_key;
	}

	private getFieldTypeUrl(): string {
		const type_node = this.getFieldTypeNode();

		return `/${type_node.id}`;
	}

	private getFieldTypeLabel(): string {
		const type_node = this.getFieldTypeNode();

		return type_node.id;
	}

	private getIndex(): number {
		const input = this.getInput();

		return input.field_index;
	}

	private getFieldTypeNode(): Node {
		const input = this.getInput();

		return input.field_type_node;
	}

	private hasFieldInstanceList(): boolean {
		const input = this.getInput();

		return input.field_instance_list !== undefined;
	}

	private getFieldInstanceList(): Node[] {
		const input = this.getInput();

		if (input.field_instance_list === undefined) {
			throw new Error('Tried to read instance list, but it was not set');
		}

		return input.field_instance_list;
	}
}

export default FieldRowTemplate;
