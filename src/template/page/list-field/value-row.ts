import Template from 'template';
import TypeNode from 'type/type-node';
import FieldValue from 'type/field-value';
import BadRequestError from 'http/error/bad-request';
import getListInnerType from 'utility/get-list-inner-type';
import getNodeParameters from 'utility/get-node-parameters';

interface Input {
	readonly field_key: string;
	readonly type_node: TypeNode;
	readonly value: FieldValue;
}

class ListRowTemplate extends Template<Input> {
	protected getHtml(): string {
		const serialized_value = this.serializeValue();

		return `
			<li>
				${serialized_value}
			</li>
		`;
	}

	private serializeValue(): string {
		if (this.isNodeList()) {
			return this.renderNodeUrl();
		}

		return this.renderPrimitive();
	}

	private isNodeList(): boolean {
		const field_key = this.getFieldKey();
		const type_node = this.getTypeNode();
		const type_field = type_node[field_key];

		if (typeof type_field !== 'string') {
			throw new BadRequestError();
		}

		const inner_type = getListInnerType(type_field);

		// TODO: Use an enum or something for this.

		switch (inner_type) {
			case 'string':
			case 'number':
			case 'boolean':
				return false;
			default:
				return true;
		}
	}

	private renderNodeUrl(): string {
		const url = this.getValue() as string;
		const parameters = getNodeParameters(url);
		const instance_id = parameters.id;

		return `
			<a href="${url}">${instance_id}</a>
		`;
	}

	private renderPrimitive(): string {
		const value = this.getValue();

		if (value === null) {
			return 'null';
		}

		return value.toString();
	}

	private getFieldKey(): string {
		const input = this.getInput();

		return input.field_key;
	}

	private getTypeNode(): TypeNode {
		const input = this.getInput();

		return input.type_node;
	}

	private getValue(): FieldValue {
		const input = this.getInput();

		return input.value;
	}
}

export default ListRowTemplate;
