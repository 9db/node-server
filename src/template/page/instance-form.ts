import Node from 'type/node';
import getNodeId from 'utility/get-node-id';
import FieldInput from 'template/page/instance-form/type/field-input';
import FieldTableTemplate from 'template/page/instance-form/field-table';
import PageTemplate, { Breadcrumb, PageTemplateInput } from 'template/page';

interface Input extends PageTemplateInput {
	readonly type_node: Node;
	readonly draft_id: string;
	readonly fields: FieldInput[];
}

class InstanceFormTemplate extends PageTemplate<Input> {
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
		const type_label = this.getTypeLabel();

		return `Create new ${type_label}`;
	}

	protected getContentHtml(): string {
		const type_url = this.getTypeUrl();
		const id_input_html = this.getIdInputHtml();
		const field_table_html = this.getFieldTableHtml();
		const submission_html = this.getSubmissionHtml();

		return `
			<form action="${type_url}" method="POST">
				${id_input_html}
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

	private getFieldTableHtml(): string {
		const fields = this.getFields();

		const input = {
			fields
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

	private getFields(): FieldInput[] {
		const input = this.getInput();

		return input.fields;
	}

	private getTypeUrl(): string {
		const type_node = this.getTypeNode();

		return type_node.url;
	}

	private getTypeLabel(): string {
		const type_node = this.getTypeNode();

		return getNodeId(type_node);
	}

	private getTypeNode(): Node {
		const input = this.getInput();

		return input.type_node;
	}
}

export default InstanceFormTemplate;
