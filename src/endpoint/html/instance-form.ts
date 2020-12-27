import Node from 'type/node';
import SystemId from 'system/enum/id';
import TypeNode from 'type/type-node';
import FieldInput from 'template/page/instance-form/type/field-input';
import HtmlEndpoint from 'endpoint/html';
import InstanceNode from 'type/instance-node';
import getFieldKeys from 'utility/get-field-keys';
import BadRequestError from 'http/error/bad-request';
import getNodeParameters from 'utility/get-node-parameters';
import FetchNodeOperation from 'operation/fetch-node';
import InstanceFormTemplate from 'template/page/instance-form';
import FetchSetFieldValuesOperation from 'operation/fetch-set-field-values';

interface Input {
	readonly id: string | undefined;
	readonly fields: Record<string, string> | undefined;
}

class HtmlInstanceFormEndpoint extends HtmlEndpoint<Input> {
	protected async process(): Promise<string> {
		const type_node = await this.fetchTypeNode();

		return this.renderFormForTypeNode(type_node);
	}

	private async fetchTypeNode(): Promise<TypeNode> {
		const id = this.getUrlParameter('type_id');
		const type_id = SystemId.GENERIC_TYPE;
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			id,
			type_id,
			repository,
			account
		};

		const operation = new FetchNodeOperation(input);
		const node = await operation.perform();

		return node as TypeNode;
	}

	private async renderFormForTypeNode(type_node: TypeNode): Promise<string> {
		const draft_id = this.getDraftId();
		const fields = await this.prepareFieldInputs(type_node);
		const account = this.getAccount();

		const input = {
			type_node,
			fields,
			draft_id,
			account
		};

		const template = new InstanceFormTemplate(input);

		return template.render();
	}

	private prepareFieldInputs(type_node: TypeNode): Promise<FieldInput[]> {
		const field_keys = getFieldKeys(type_node);

		const promises = field_keys.map((field_key) => {
			const type_url = type_node[field_key];

			if (typeof type_url !== 'string') {
				throw new BadRequestError();
			}

			return this.prepareFieldInputForKey(field_key, type_url);
		});

		return Promise.all(promises);
	}

	private async prepareFieldInputForKey(
		key: string,
		type_url: string
	): Promise<FieldInput> {
		const node = await this.fetchNodeForUrl(type_url);
		const type_node = node as TypeNode;
		const instance_list = await this.fetchInstanceListForTypeNode(type_node);
		const draft_value = this.getDraftValueForFieldKey(key);

		return {
			key,
			type_node,
			instance_list,
			draft_value
		};
	}

	private fetchNodeForUrl(url: string): Promise<Node> {
		const node_parameters = getNodeParameters(url);
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			...node_parameters,
			repository,
			account
		};

		const operation = new FetchNodeOperation(input);

		return operation.perform();
	}

	private async fetchInstanceListForTypeNode(
		type_node: TypeNode
	): Promise<InstanceNode[] | undefined> {
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			node: type_node,
			field_key: 'instances',
			repository,
			account
		};

		const operation = new FetchSetFieldValuesOperation(input);
		const result = await operation.perform();
		const instance_urls = result as string[];

		const promises = instance_urls.map((instance_url) => {
			return this.fetchNodeForUrl(instance_url);
		});

		const nodes = await Promise.all(promises);

		return nodes as InstanceNode[];
	}

	private getDraftValueForFieldKey(field_key: string): string {
		const draft_field_values = this.getDraftFieldValues();

		return draft_field_values[field_key] || '';
	}

	private getDraftFieldValues(): Record<string, string> {
		const body = this.getRequestBody();

		return body.fields || {};
	}

	private getDraftId(): string {
		const request_body = this.getRequestBody();

		return request_body.id || '';
	}
}

export default HtmlInstanceFormEndpoint;
