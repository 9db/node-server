import Node from 'type/node';
import JsonEndpoint from 'endpoint/json';
import UpdateNodeOperation, { ChangeInput } from 'operation/update-node';

interface Input {
	readonly changes: ChangeInput[];
}

class JsonUpdateNodeEndpoint extends JsonEndpoint<Input> {
	protected async process(): Promise<Node> {
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

		const operation = new UpdateNodeOperation(input);

		return operation.perform();
	}
}

export default JsonUpdateNodeEndpoint;
