import Node from 'type/node';
import SystemId from 'system/enum/id';
import FieldInput from 'template/page/instance-form/type/field-input';
import HtmlEndpoint from 'endpoint/html';
import getFieldKeys from 'utility/get-field-keys';
import BadRequestError from 'http/error/bad-request';
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

	private fetchTypeNode(): Promise<Node> {
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

		return operation.perform();
	}

	private async renderFormForTypeNode(type_node: Node): Promise<string> {
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

	private prepareFieldInputs(type_node: Node): Promise<FieldInput[]> {
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
		const type_node = await this.fetchNodeForUrl(type_url);
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
		// TODO: remote url's
		const parts = url.split('/');
		const id = parts.pop() as string;

		let type_id = parts.pop() as string;

		if (/^[A-Za-z0-9]+$/.test(type_id) === false || type_id === 'localhost') {
			type_id = SystemId.GENERIC_TYPE;
		}

		console.log(type_id);

		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			id,
			type_id,
			repository,
			account
		};

		const operation = new FetchNodeOperation(input);

		return operation.perform();
	}

	private async fetchInstanceListForTypeNode(
		type_node: Node
	): Promise<Node[] | undefined> {
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			node: type_node,
			field_key: 'instances',
			repository,
			account
		};

		const operation = new FetchSetFieldValuesOperation(input);
		const instance_urls = (await operation.perform()) as string[];

		const promises = instance_urls.map((instance_url) => {
			return this.fetchNodeForUrl(instance_url);
		});

		return Promise.all(promises);
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
