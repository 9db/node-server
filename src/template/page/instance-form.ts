import Node from 'type/node';
import FieldTableTemplate from 'template/page/instance-form/field-table';
import PageTemplate, { Breadcrumb, PageTemplateInput } from 'template/page';

interface Input extends PageTemplateInput {
	readonly type_node: Node;
	readonly field_type_nodes: Record<string, Node>;
	readonly field_instance_lists: Record<string, Node[]>;
	readonly draft_id: string;
	readonly draft_field_values: Record<string, string>;
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
		const type_node = this.getTypeNode();
		const draft_field_values = this.getDraftFieldValues();
		const field_type_nodes = this.getFieldTypeNodes();
		const field_instance_lists = this.getFieldInstanceLists();

		const input = {
			type_node,
			draft_field_values,
			field_type_nodes,
			field_instance_lists
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

	private getDraftFieldValues(): Record<string, string> {
		const input = this.getInput();

		return input.draft_field_values;
	}

	private getFieldTypeNodes(): Record<string, Node> {
		const input = this.getInput();

		return input.field_type_nodes;
	}

	private getFieldInstanceLists(): Record<string, Node[]> {
		const input = this.getInput();

		return input.field_instance_lists;
	}

	private getTypeUrl(): string {
		const type_node = this.getTypeNode();

		return `/${type_node.id}`;
	}

	private getTypeLabel(): string {
		const type_node = this.getTypeNode();

		return type_node.id;
	}

	private getTypeNode(): Node {
		const input = this.getInput();

		return input.type_node;
	}
}

export default InstanceFormTemplate;
