import DraftField from 'type/draft-field';
import JsonEndpoint from 'endpoint/json';
import InstanceNode from 'type/instance-node';
import NodeParameters from 'type/node-parameters';
import CreateInstanceOperation from 'operation/create-instance';

interface Input {
	readonly fields: DraftField[];
}

class JsonCreateInstanceEndpoint extends JsonEndpoint<Input> {
	protected async process(): Promise<InstanceNode> {
		const node_parameters = this.getNodeParameters();
		const fields = this.getDraftFields();
		const repository = this.getRepository();
		const account = this.getAccount();

		const operation = new CreateInstanceOperation({
			node_parameters,
			fields,
			repository,
			account
		});

		return operation.perform();
	}

	private getNodeParameters(): NodeParameters {
		const type_id = this.getUrlParameter('type_id');
		const id = this.getUrlParameter('id');

		return {
			type_id,
			id
		};
	}

	private getDraftFields(): DraftField[] {
		const request_body = this.getRequestBody();

		return request_body.fields || [];
	}
}

export default JsonCreateInstanceEndpoint;
