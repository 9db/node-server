import TypeNode from 'type/type-node';
import FieldInput from 'template/page/instance-form/type/field-input';
import HtmlEndpoint from 'endpoint/html';
import InstanceNode from 'type/instance-node';
import getFieldKeys from 'utility/get-field-keys';
import BadRequestError from 'http/error/bad-request';
import InstanceFormTemplate from 'template/page/instance-form';
import FetchTypeInstancesOperation from 'operation/fetch-type-instances';

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
		const type_id = this.getUrlParameter('type_id');

		return this.fetchType(type_id);
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
		const type_node = await this.loadTypeFromUrl(type_url);
		const instance_list = await this.fetchInstanceListForTypeNode(type_node);
		const draft_value = this.getDraftValueForFieldKey(key);

		return {
			key,
			type_node,
			instance_list,
			draft_value
		};
	}

	private fetchInstanceListForTypeNode(
		type_node: TypeNode
	): Promise<InstanceNode[]> {
		const repository = this.getRepository();
		const account = this.getAccount();

		console.log('>>>>>');
		console.log('>>>>>');
		console.log(type_node);
		console.log('>>>>>');
		console.log('>>>>>');

		const input = {
			type_node,
			repository,
			account
		};

		const operation = new FetchTypeInstancesOperation(input);

		return operation.perform();
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
