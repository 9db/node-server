import Node from 'type/node';
import JsonEndpoint from 'endpoint/json';
import UpdateNodeOperation, { ChangeInput } from 'operation/update-node';

interface Input {
	readonly changes: ChangeInput[];
}

class JsonUpdateNodeEndpoint extends JsonEndpoint<Input> {
	protected async process(): Promise<Node> {
		const namespace_key = this.getUrlParameter('namespace_key');
		const type_key = this.getUrlParameter('type_key');
		const key = this.getUrlParameter('key');
		const body = this.getRequestBody();
		const changes = body.changes;

		const input = {
			namespace_key,
			type_key,
			key,
			changes
		};

		const repository = this.getRepository();
		const operation = new UpdateNodeOperation(repository, input);

		return operation.perform();
	}
}

export default JsonUpdateNodeEndpoint;
