import TypeNode from 'type/type-node';
import FieldValue from 'type/field-value';
import PageTemplate, { Breadcrumb, PageTemplateInput } from 'template/page';

interface Input extends PageTemplateInput {
	type_node: TypeNode;
	values: FieldValue[];
}

class InstanceDetailsTemplate extends PageTemplate<Input> {
	protected getBreadcrumbs(): Breadcrumb[] {
		return [
			{
				label: 'list type id'
			},
			{
				label: 'list id'
			}
		];
	}

	protected getContentTitle(): string {
		return 'some list';
	}

	protected getContentHtml(): string {
		const values = this.getValues() as string[];
		const serialized_values = values.join('\n');

		return `
			<ul>
				${serialized_values}
			</ul>
		`;
	}

	private getValues(): FieldValue[] {
		const input = this.getInput();

		return input.values;
	}
}

export default InstanceDetailsTemplate;
