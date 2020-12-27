import TypeNode from 'type/type-node';
import Template from 'template';
import getFieldKeys from 'utility/get-field-keys';

interface Input {
	readonly node: TypeNode;
	readonly type_nodes: TypeNode[];
}

class FieldTableTemplate extends Template<Input> {
	protected getHtml(): string {
		if (!this.hasFields()) {
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
		const field_keys = this.getFieldKeys();

		const serialized_fields = field_keys.map((field_key) => {
			return this.serializeField(field_key);
		});

		const result = serialized_fields.join('\n');

		return result;
	}

	private serializeField(field_key: string): string {
		const node = this.getNode();
		const field_value = node[field_key];

		return `
			<tr>
				<td>${field_key}</td>
				<td>${field_value}</td>
			</tr>
		`;
	}

	private hasFields(): boolean {
		const field_keys = this.getFieldKeys();

		return field_keys.length > 0;
	}

	private getFieldKeys(): string[] {
		const node = this.getNode();

		return getFieldKeys(node);
	}

	private getNode(): TypeNode {
		const input = this.getInput();

		return input.node;
	}
}

export default FieldTableTemplate;
