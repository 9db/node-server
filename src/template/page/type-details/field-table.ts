import Node from 'type/node';
import Template from 'template';
import FieldValue from 'type/field-value';
import SystemFieldKey from 'system/enum/field-key';

interface Input {
	readonly node: Node;
	readonly type_nodes: Node[];
}

class FieldTableTemplate extends Template<Input> {
	protected getHtml(): string {
		if (!this.hasNonSystemFields()) {
			return this.getEmptyHtml();
		}

		const rows_html = this.getRowsHtml();

		return `
			<table>
				<thead>
					<tr>
						<th>
							Key
						</th>
						<th>
							Type
						</th>
					</tr>
				</thead>
				<tbody>
					${rows_html}
				</tbody>
			</table>
		`;
	}

	private getEmptyHtml(): string {
		return `
			<em>No fields specified</em>
		`;
	}

	private getRowsHtml(): string {
		const node = this.getNode();
		const field_keys = Object.keys(node);
		const serialized_fields: string[] = [];

		field_keys.forEach((field_key) => {
			if (this.isSystemFieldKey(field_key)) {
				return;
			}

			const field_value = node[field_key];
			const serialized_field = this.serializeField(field_key, field_value);

			serialized_fields.push(serialized_field);
		});

		const result = serialized_fields.join('\n');

		return result;
	}

	private serializeField(field_key: string, field_value: FieldValue): string {
		return `
			<tr>
				<td>${field_key}</td>
				<td>${field_value}</td>
			</tr>
		`;
	}

	private hasNonSystemFields(): boolean {
		const node = this.getNode();
		const field_keys = Object.keys(node);

		return field_keys.some((field_key) => {
			return !this.isSystemFieldKey(field_key);
		});
	}

	private isSystemFieldKey(field_key: string): boolean {
		const field_keys = Object.values(SystemFieldKey) as string[];

		return field_keys.includes(field_key);
	}

	private getNode(): Node {
		const input = this.getInput();

		return input.node;
	}
}

export default FieldTableTemplate;
