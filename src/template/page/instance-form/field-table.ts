import Template from 'template';
import FieldInput from 'template/page/instance-form/type/field-input';
import FieldRowTemplate from 'template/page/instance-form/field-row';

interface Input {
	readonly fields: FieldInput[];
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
		const fields = this.getFields();

		const serialized_fields = fields.map((field, index) => {
			return this.serializeField(field, index);
		});

		return serialized_fields.join('\n');
	}

	private serializeField(field: FieldInput, index: number): string {
		const input = {
			...field,
			index
		};

		const template = new FieldRowTemplate(input);

		return template.render();
	}

	private getFields(): FieldInput[] {
		const input = this.getInput();

		return input.fields;
	}

	private getValueListHeader(): string {
		return 'Value from list, or';
	}

	private getExplicitValueHeader(): string {
		return 'Explicit value';
	}
}

export default FieldTableTemplate;
