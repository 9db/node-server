import Template from 'template';
import FieldInput from 'template/page/instance-details/type/field-input';
import FieldRowTemplate from 'template/page/instance-details/field-row';

interface Input {
	readonly fields: FieldInput[];
}

class FieldTableTemplate extends Template<Input> {
	protected getHtml(): string {
		const field_rows_html = this.getFieldRowsHtml();

		return `
			<table>
				<thead>
					<tr>
						<th>Key</th>
						<th>Type</th>
						<th>Value</th>
					</tr>
				</thead>
				<tbody>
					${field_rows_html}
				</tbody>
			</table>
		`;
	}

	private getFieldRowsHtml(): string {
		const fields = this.getFields();

		const serialized_fields = fields.map((field) => {
			return this.getFieldRowHtml(field);
		});

		return serialized_fields.join('\n');
	}

	private getFieldRowHtml(field: FieldInput): string {
		const template = new FieldRowTemplate(field);

		return template.render();
	}

	private getFields(): FieldInput[] {
		const input = this.getInput();

		return input.fields;
	}
}

export default FieldTableTemplate;
