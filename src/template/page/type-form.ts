import TypeNode from 'type/type-node';
import DraftField from 'type/draft-field';
import getNodeParameters from 'utility/get-node-parameters';
import FieldTableTemplate from 'template/page/type-form/field-table';
import PageTemplate, { Breadcrumb, PageTemplateInput } from 'template/page';

interface Input extends PageTemplateInput {
	readonly generic_type: TypeNode;
	readonly draft_id: string;
	readonly draft_fields: DraftField[];
	readonly type_nodes: TypeNode[];
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
		const field_table_html = this.getFieldTableHtml();
		const submission_html = this.getSubmissionHtml();

		return `
			<form action="/type" method="POST">
				${id_input_html}
				${parent_type_input_html}
				${field_table_html}
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

	private getFieldTableHtml(): string {
		const draft_fields = this.getDraftFields();
		const type_nodes = this.getTypeNodes();

		const input = {
			draft_fields,
			type_nodes
		};

		const template = new FieldTableTemplate(input);

		return template.render();
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

	private getTypeNodes(): TypeNode[] {
		const input = this.getInput();

		return input.type_nodes;
	}

	private getTypeUrl(): string {
		const node = this.getGenericType();

		return node.url;
	}

	private getTypeLabel(): string {
		const node = this.getGenericType();
		const parameters = getNodeParameters(node.url);

		return parameters.id;
	}

	private getGenericType(): TypeNode {
		const input = this.getInput();

		return input.generic_type;
	}
}

export default TypeFormTemplate;
