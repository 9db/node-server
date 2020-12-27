import DraftField from 'type/draft-field';
import HtmlEndpoint from 'endpoint/html';
import NodeParameters from 'type/node-parameters';
import CreateInstanceOperation from 'operation/create-instance';

interface Input {
	readonly id: string | undefined;
	readonly fields: DraftField[] | undefined;
}

class HtmlCreateInstanceEndpoint extends HtmlEndpoint<Input> {
	protected async process(): Promise<void> {
		const node_parameters = this.getNodeParameters();
		const fields = this.getDraftFields();
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			node_parameters,
			fields,
			repository,
			account
		};

		const operation = new CreateInstanceOperation(input);
		const node = await operation.perform();

		this.redirectToUrl(node.url);
	}

	private getNodeParameters(): NodeParameters {
		const type_id = this.getTypeId();
		const id = this.getId();

		return {
			type_id,
			id
		};
	}

	private getTypeId(): string {
		return this.getUrlParameter('type_id');
	}

	private getId(): string {
		const request_body = this.getRequestBody();

		return request_body.id || '';
	}

	private getDraftFields(): DraftField[] {
		const request_body = this.getRequestBody();

		return request_body.fields || [];
	}
}

export default HtmlCreateInstanceEndpoint;
