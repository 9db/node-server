import Node from 'type/node';
import DraftField from 'type/draft-field';
import PageTemplate, { Breadcrumb, PageTemplateInput } from 'template/page';

interface Input extends PageTemplateInput {
	readonly node: Node;
	readonly draft_id: string;
	readonly draft_fields: DraftField[];
}

class TypeFormTemplate extends PageTemplate<Input> {
	protected getBreadcrumbs(): Breadcrumb[] {
		const type_label = this.getTypeLabel();
		const type_url = this.getTypeUrl();

		return [
			{
				label: type_label,
				url: type_url
			},
			{
				label: 'new'
			}
		];
	}

	protected getContentTitle(): string {
		return 'Create new type';
	}

	protected getContentHtml(): string {
		const id_input_html = this.getIdInputHtml();
		const parent_type_input_html = this.getParentTypeInputHtml();
		const field_inputs_html = this.getFieldInputsHtml();
		const submission_html = this.getSubmissionHtml();

		return `
			<form action="/type" method="POST">
				${id_input_html}
				${parent_type_input_html}
				${field_inputs_html}
				${submission_html}
			</form>
		`;
	}

	private getIdInputHtml(): string {
		const draft_id = this.getDraftId();

		return `
			<fieldset>
				<label for="id">
					ID:
				</label>
				<input name="id" type="text" value="${draft_id}" />
			</fieldset>
		`;
	}

	private getParentTypeInputHtml(): string {
		return `
			<fieldset>
				<label for="parent_type">
					Parent type URL:
					<em>(optional)</em>
				</label>
				<input name="parent_type" type="text" />
			</fieldset>
		`;
	}

	private getFieldInputsHtml(): string {
		const draft_fields = this.getDraftFields();

		const serialized_fields = draft_fields.map((field, index) => {
			return this.serializeDraftField(field, index);
		});

		const fields_html = serialized_fields.join('\n');

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
								Value
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

	private serializeDraftField(draft_field: DraftField, index: number): string {
		const {key, value} = draft_field;
		const display_index = index + 1;

		return `
			<tr>
				<td>
					${display_index}
				</td>
				<td>
					<input name="fields[${index}][key]" value="${key}" />
				</td>
				<td>
					<input name="fields[${index}][value]" value="${value}" />
				</td>
				<td>
					<input type="submit" formaction="/type/new?action=remove_field&index=${index}" formmethod="POST" value="x" />
				</td>
			</tr>
		`;
	}

	private getSubmissionHtml(): string {
		return `
			<input type="submit" value="Submit" />
		`;
	}

	private getDraftId(): string {
		const input = this.getInput();

		return input.draft_id;
	}

	private getDraftFields(): DraftField[] {
		const input = this.getInput();

		return input.draft_fields;
	}

	private getTypeUrl(): string {
		const node = this.getNode();

		return `/${node.id}`;
	}

	private getTypeLabel(): string {
		const node = this.getNode();

		return node.id;
	}

	private getNode(): Node {
		const input = this.getInput();

		return input.node;
	}
}

export default TypeFormTemplate;
