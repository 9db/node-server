import Template from 'template';
import FieldInput from 'template/page/type-details/type/field-input';
import FieldRowTemplate from 'template/page/type-details/field-row';

interface Input {
	readonly fields: FieldInput[];
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
		const fields = this.getFields();

		const serialized_fields = fields.map((field) => {
			return this.serializeField(field);
		});

		const result = serialized_fields.join('\n');

		return result;
	}

	private serializeField(field: FieldInput): string {
		const template = new FieldRowTemplate(field);

		return template.render();
	}

	private hasFields(): boolean {
		const fields = this.getFields();

		return fields.length > 0;
	}

	private getFields(): FieldInput[] {
		const input = this.getInput();

		return input.fields;
	}
}

export default FieldTableTemplate;
