import InstanceNode from 'type/instance-node';
import getNodeParameters from 'utility/get-node-parameters';
import PageTemplate, { Breadcrumb, PageTemplateInput } from 'template/page';

interface Input extends PageTemplateInput {
	readonly instance: InstanceNode;
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
		const instance_label = this.getInstanceLabel();

		return `Edit ${type_label}: ${instance_label}`;
	}

	protected getContentHtml(): string {
		return 'Some content here';
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
}

export default EditInstanceFormTemplate;
