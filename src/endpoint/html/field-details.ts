import TypeNode from 'type/type-node';
import FieldValue from 'type/field-value';
import HtmlEndpoint from 'endpoint/html';
import InstanceNode from 'type/instance-node';
import BadRequestError from 'http/error/bad-request';
import getListInnerType from 'utility/get-list-inner-type';
import ListFieldTemplate from 'template/page/list-field';
import getNodeParameters from 'utility/get-node-parameters';
import FetchListFieldValuesOperation from 'operation/fetch-list-field-values';

class HtmlFieldDetailsEndpoint extends HtmlEndpoint<Record<string, never>> {
	protected async process(): Promise<string> {
		const type_id = this.getUrlParameter('type_id');
		const instance_id = this.getUrlParameter('instance_id');

		const instance = await this.fetchInstance(type_id, instance_id);
		const type_node = await this.loadTypeFromUrl(instance.type);

		if (this.isList(type_node)) {
			return this.renderList(instance, type_node);
		}

		throw new BadRequestError();
	}

	private isList(type_node: TypeNode): boolean {
		const inner_type_id = this.getListInnerTypeId(type_node);

		return inner_type_id !== null;
	}

	private getListInnerTypeId(type_node: TypeNode): string | null {
		const field_key = this.getFieldKey();
		const field_url = type_node[field_key];

		if (typeof field_url !== 'string') {
			throw new BadRequestError();
		}

		const parameters = getNodeParameters(field_url);

		return getListInnerType(parameters.type_id);
	}

	private getFieldKey(): string {
		return this.getUrlParameter('field_key');
	}

	private async fetchListValues(instance: InstanceNode): Promise<FieldValue[]> {
		const repository = this.getRepository();
		const account = this.getAccount();
		const field_key = this.getFieldKey();

		const input = {
			node: instance,
			field_key,
			repository,
			account
		};

		const operation = new FetchListFieldValuesOperation(input);

		return operation.perform();
	}

	private async renderList(
		instance: InstanceNode,
		type_node: TypeNode
	): Promise<string> {
		const account = this.getAccount();
		const field_key = this.getFieldKey();
		const values = await this.fetchListValues(instance);

		const input = {
			instance,
			type_node,
			field_key,
			values,
			account
		};

		const template = new ListFieldTemplate(input);

		return template.render();
	}
}

export default HtmlFieldDetailsEndpoint;
