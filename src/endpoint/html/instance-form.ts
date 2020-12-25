import Node from 'type/node';
import SystemId from 'system/enum/id';
import HtmlEndpoint from 'endpoint/html';
import FetchNodeOperation from 'operation/fetch-node';
import InstanceFormTemplate from 'template/page/instance-form';

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
		const field_type_nodes = await this.fetchFieldTypeNodes();
		const field_instance_lists = await this.fetchFieldInstanceLists();
		const draft_id = this.getDraftId();
		const draft_field_values = this.getDraftFieldValues();
		const account = this.getAccount();

		const input = {
			type_node,
			field_type_nodes,
			field_instance_lists,
			draft_id,
			draft_field_values,
			account
		};

		const template = new InstanceFormTemplate(input);

		return template.render();
	}

	private fetchFieldTypeNodes(): Promise<Record<string, Node>> {
		return Promise.resolve({});
	}

	private fetchFieldInstanceLists(): Promise<Record<string, Node[]>> {
		return Promise.resolve({});
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
