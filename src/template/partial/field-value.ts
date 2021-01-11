import Template from 'template';
import valueIsUrl from 'utility/value-is-url';
import getNodeParameters from 'utility/get-node-parameters';
import FieldValue, { PrimitiveValue } from 'type/field-value';

interface Input {
	readonly value: FieldValue;
}

class FieldValueTemplate extends Template<Input> {
	protected getHtml(): string {
		if (this.valueIsList()) {
			return this.formatValueAsList();
		}

		if (this.valueIsUrl()) {
			return this.formatValueAsUrl();
		}

		return this.formatValueAsString();
	}

	private valueIsList(): boolean {
		const value = this.getValue();

		return Array.isArray(value);
	}

	private valueIsUrl(): boolean {
		const value = this.getValue();

		return valueIsUrl(value);
	}

	private formatValueAsList(): string {
		const value = this.getValue();
		const list = value as PrimitiveValue[];

		const serialized_elements = list.map((element) => {
			return this.serializeListElement(element);
		});

		const list_html = serialized_elements.join('\n');

		return `
			<ul>
				${list_html}
			</ul>
		`;
	}

	private serializeListElement(element: PrimitiveValue): string {
		const input = {
			value: element
		};

		const template = new FieldValueTemplate(input);
		const serialized_element = template.render();

		return `
			<li>
				${serialized_element}
			</li>
		`;
	}

	private formatValueAsUrl(): string {
		const value = this.getValue() as string;
		const parameters = getNodeParameters(value);
		const id = parameters.id;

		return `
			<a href="${value}">${id}</a>
		`;
	}

	private formatValueAsString(): string {
		const value = this.getValue();

		if (value === null) {
			return 'null';
		}

		return value.toString();
	}

	private getValue(): FieldValue {
		const input = this.getInput();

		return input.value;
	}
}

export default FieldValueTemplate;
