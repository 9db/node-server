import TypeNode from 'type/type-node';
import FieldValue from 'type/field-value';
import InstanceNode from 'type/instance-node';
import getNodeParameters from 'utility/get-node-parameters';
import PageTemplate, { Breadcrumb, PageTemplateInput } from 'template/page';
import ListValueRowTemplate from 'template/page/list-field/value-row';

interface Input extends PageTemplateInput {
	readonly instance: InstanceNode;
	readonly type_node: TypeNode;
	readonly field_key: string;
	readonly values: FieldValue[];
}

class ListFieldTemplate extends PageTemplate<Input> {
	protected getBreadcrumbs(): Breadcrumb[] {
		const type_id = this.getTypeId();
		const type_url = this.getTypeUrl();
		const instance_id = this.getInstanceId();
		const instance_url = this.getInstanceUrl();
		const field_key = this.getFieldKey();

		return [
			{
				label: type_id,
				url: type_url
			},
			{
				label: instance_id,
				url: instance_url
			},
			{
				label: field_key
			}
		];
	}

	protected getContentTitle(): string {
		const instance_id = this.getInstanceId();
		const field_key = this.getFieldKey();

		return `${instance_id} ${field_key}`;
	}

	protected getContentHtml(): string {
		const list_html = this.getListHtml();

		return `
			<section>
				<ul>
					${list_html}
				</ul>
			</section>
		`;
	}

	private getListHtml(): string {
		const values = this.getValues();

		const serialized_values = values.map((value) => {
			return this.serializeValue(value);
		});

		return serialized_values.join('\n');
	}

	private serializeValue(value: FieldValue): string {
		const field_key = this.getFieldKey();
		const type_node = this.getTypeNode();

		const input = {
			field_key,
			type_node,
			value
		};

		const template = new ListValueRowTemplate(input);

		return template.render();
	}

	private getInstanceUrl(): string {
		const instance = this.getInstance();

		return instance.url;
	}

	private getTypeUrl(): string {
		const instance = this.getInstance();

		return instance.type;
	}

	private getTypeId(): string {
		const instance = this.getInstance();
		const parameters = getNodeParameters(instance.url);

		return parameters.type_id;
	}

	private getInstanceId(): string {
		const instance = this.getInstance();
		const parameters = getNodeParameters(instance.url);

		return parameters.id;
	}

	private getInstance(): InstanceNode {
		const input = this.getInput();

		return input.instance;
	}

	private getFieldKey(): string {
		const input = this.getInput();

		return input.field_key;
	}

	private getTypeNode(): TypeNode {
		const input = this.getInput();

		return input.type_node;
	}

	private getValues(): FieldValue[] {
		const input = this.getInput();

		return input.values;
	}
}

export default ListFieldTemplate;
