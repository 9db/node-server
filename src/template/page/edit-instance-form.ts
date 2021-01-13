import FieldInput from 'template/page/edit-instance-form/type/field-input';
import InstanceNode from 'type/instance-node';
import getNodeParameters from 'utility/get-node-parameters';
import FieldTableTemplate from 'template/page/edit-instance-form/field-table';
import PageTemplate, { Breadcrumb, PageTemplateInput } from 'template/page';

interface Input extends PageTemplateInput {
	readonly instance: InstanceNode;
	readonly fields: FieldInput[];
}

class EditInstanceFormTemplate extends PageTemplate<Input> {
	protected getBreadcrumbs(): Breadcrumb[] {
		const type_label = this.getTypeLabel();
		const type_url = this.getTypeUrl();
		const instance_label = this.getInstanceLabel();
		const instance_url = this.getInstanceUrl();

		return [
			{
				label: type_label,
				url: type_url
			},
			{
				label: instance_label,
				url: instance_url
			},
			{
				label: 'edit'
			}
		];
	}

	protected getContentTitle(): string {
		const type_label = this.getTypeLabel();

		return `Edit ${type_label}`;
	}

	protected getContentHtml(): string {
		const instance_url = this.getInstanceUrl();
		const id_input_html = this.getIdInputHtml();
		const field_table_html = this.getFieldTableHtml();
		const submission_html = this.getSubmissionHtml();

		return `
			<form action="${instance_url}" method="POST">
				${id_input_html}
				${field_table_html}
				${submission_html}
			</form>
		`;
	}

	private getIdInputHtml(): string {
		const instance_id = this.getInstanceId();

		return `
			<fieldset>
				<label for="id">
					ID:
				</label>
				<input name="id" type="text" disabled value="${instance_id}" />
				<p>
					<em>You are not able to edit the node ID after creation.</em>
				</p>
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

	private getTypeLabel(): string {
		const type_url = this.getTypeUrl();
		const parameters = getNodeParameters(type_url);

		return parameters.id;
	}

	private getTypeUrl(): string {
		const instance = this.getInstance();

		return instance.type;
	}

	private getInstanceLabel(): string {
		return this.getInstanceId();
	}

	private getInstanceId(): string {
		const instance_url = this.getInstanceUrl();
		const parameters = getNodeParameters(instance_url);

		return parameters.id;
	}

	private getInstanceUrl(): string {
		const instance = this.getInstance();

		return instance.url;
	}

	private getInstance(): InstanceNode {
		const input = this.getInput();

		return input.instance;
	}

	private getFields(): FieldInput[] {
		const input = this.getInput();

		return input.fields;
	}
}

export default EditInstanceFormTemplate;
