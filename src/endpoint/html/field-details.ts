import TypeNode from 'type/type-node';
import HtmlEndpoint from 'endpoint/html';
import InstanceNode from 'type/instance-node';
import BadRequestError from 'http/error/bad-request';
import getListInnerType from 'utility/get-list-inner-type';
import getNodeParameters from 'utility/get-node-parameters';

class HtmlFieldDetailsEndpoint extends HtmlEndpoint<Record<string, never>> {
	protected async process(): Promise<string> {
		const type_id = this.getUrlParameter('type_id');
		const instance_id = this.getUrlParameter('instance_id');

		const instance_node = await this.fetchInstance(type_id, instance_id);
		const type_node = await this.loadTypeFromUrl(instance_node.type);

		if (this.isList(type_node)) {
			return this.renderList(instance_node, type_node);
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

	private renderList(
		instance_node: InstanceNode,
		type_node: TypeNode
	): Promise<string> {
		return Promise.resolve('asdf');
	}
}

export default HtmlFieldDetailsEndpoint;
