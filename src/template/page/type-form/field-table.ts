import Template from 'template';
import TypeNode from 'type/type-node';
import DraftField from 'type/draft-field';
import FieldRowTemplate from 'template/page/type-form/field-row';

interface Input {
	readonly draft_fields: DraftField[];
	readonly type_nodes: TypeNode[];
}

class FieldTableTemplate extends Template<Input> {
	protected getHtml(): string {
		const fields_html = this.getFieldsHtml();
		const type_list_header = this.getTypeListHeader();
		const explicit_type_header = this.getExplicitTypeHeader();

		return `
			<fieldset>
				<label>Fields:</label>
				<table>
					<thead>
						<tr>
							<th></th>
							<th>
								Key
							</th>
							<th>
								${type_list_header}
							</th>
							<th>
								${explicit_type_header}
							</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						${fields_html}
					</tbody>
					<caption>
						<input type="submit" formaction="/type/new?action=add_field" formmethod="POST" value="Add another field" />
					</caption>
				</table>
			</fieldset>
		`;
	}

	private getFieldsHtml(): string {
		const draft_fields = this.getDraftFields();

		const serialized_fields = draft_fields.map((field, index) => {
			return this.serializeDraftField(field, index);
		});

		return serialized_fields.join('\n');
	}

	private serializeDraftField(draft_field: DraftField, index: number): string {
		const type_nodes = this.getTypeNodes();

		const input = {
			draft_field,
			index,
			type_nodes
		};

		const template = new FieldRowTemplate(input);

		return template.render();
	}

	private getTypeListHeader(): string {
		return 'Type from list, or';
	}

	private getExplicitTypeHeader(): string {
		return 'Explicit type';
	}

	private getDraftFields(): DraftField[] {
		const input = this.getInput();

		return input.draft_fields;
	}

	private getTypeNodes(): TypeNode[] {
		const input = this.getInput();

		return input.type_nodes;
	}
}

export default FieldTableTemplate;
