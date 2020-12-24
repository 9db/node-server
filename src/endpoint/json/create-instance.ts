import Node from 'type/node';
import DraftField from 'type/draft-field';
import JsonEndpoint from 'endpoint/json';
import CreateInstanceOperation from 'operation/create-instance';

interface Input {
	readonly fields: DraftField[];
}

class JsonCreateInstanceEndpoint extends JsonEndpoint<Input> {
	protected async process(): Promise<Node> {
		const id = this.getUrlParameter('id');
		const type_id = this.getUrlParameter('type_id');
		const fields = this.getDraftFields();
		const repository = this.getRepository();
		const account = this.getAccount();

		const operation = new CreateInstanceOperation({
			id,
			type_id,
			fields,
			repository,
			account
		});

		return operation.perform();
	}

	private getDraftFields(): DraftField[] {
		const request_body = this.getRequestBody();

		return request_body.fields || [];
	}
}

export default JsonCreateInstanceEndpoint;
