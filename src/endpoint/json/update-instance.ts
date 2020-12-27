import JsonEndpoint from 'endpoint/json';
import InstanceNode from 'type/instance-node';
import UpdateInstanceOperation, { ChangeInput } from 'operation/update-node';

interface Input {
	readonly changes: ChangeInput[];
}

class JsonUpdateInstanceEndpoint extends JsonEndpoint<Input> {
	protected async process(): Promise<InstanceNode> {
		const id = this.getUrlParameter('id');
		const type_id = this.getUrlParameter('type_id');
		const body = this.getRequestBody();
		const changes = body.changes;
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			id,
			type_id,
			changes,
			repository,
			account
		};

		const operation = new UpdateInstanceOperation(input);

		return operation.perform();
	}
}

export default JsonUpdateInstanceEndpoint;
