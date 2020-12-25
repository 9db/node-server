import Node from 'type/node';
import Template from 'template';
import isSystemFieldKey from 'system/utility/is-system-field-key';
import FieldRowTemplate from 'template/page/instance-form/field-row';

interface Input {
	readonly type_node: Node;
	readonly draft_field_values: Record<string, string>;
	readonly field_type_nodes: Record<string, Node>;
	readonly field_instance_lists: Record<string, Node[]>;
}

class FieldTableTemplate extends Template<Input> {
	protected getHtml(): string {
		const value_list_header = this.getValueListHeader();
		const explicit_value_header = this.getExplicitValueHeader();
		const field_rows_html = this.getFieldRowsHtml();

		return `
			<table>
				<thead>
					<tr>
						<th>Key</th>
						<th>Label</th>
						<th>Type</th>
						<th>${value_list_header}</th>
						<th>${explicit_value_header}</th>
					</tr>
				</thead>
				<tbody>
					${field_rows_html}
				</tbody>
			</table>
		`;
	}

	private getFieldRowsHtml(): string {
		const field_keys = this.getFieldKeys();

		const serialized_fields = field_keys.map((field_key, index) => {
			return this.getFieldRowHtml(field_key, index);
		});

		return serialized_fields.join('\n');
	}

	private getFieldRowHtml(field_key: string, field_index: number): string {
		const field_type_node = this.getFieldTypeNodeForFieldKey(field_key);
		const field_instance_list = this.getFieldInstanceListForFieldKey(field_key);

		const input = {
			field_key,
			field_index,
			field_type_node,
			field_instance_list
		};

		const template = new FieldRowTemplate(input);

		return template.render();
	}

	private getValueListHeader(): string {
		return 'Value from list, or';
	}

	private getExplicitValueHeader(): string {
		return 'Explicit value';
	}

	private getFieldTypeNodeForFieldKey(field_key: string): Node {
		const field_type_nodes = this.getFieldTypeNodes();
		const field_type_node = field_type_nodes[field_key];

		if (field_type_node === undefined) {
			throw new Error(`Unable to find type node for url ${field_key}`);
		}

		return field_type_node;
	}

	private getFieldInstanceListForFieldKey(field_key: string): Node[] | undefined {
		const field_instance_lists = this.getFieldInstanceLists();

		return field_instance_lists[field_key];
	}

	private getFieldKeys(): string[] {
		const type_node = this.getTypeNode();
		const field_keys = Object.keys(type_node);

		return field_keys.filter((field_key) => {
			return isSystemFieldKey(field_key) === false;
		});
	}

	private getTypeNode(): Node {
		const input = this.getInput();

		return input.type_node;
	}

	private getFieldInstanceLists(): Record<string, Node[]> {
		const input = this.getInput();

		return input.field_instance_lists;
	}

	private getFieldTypeNodes(): Record<string, Node> {
		const input = this.getInput();

		return input.field_type_nodes;
	}
}

export default FieldTableTemplate;
