import Node from 'type/node';
import JsonEndpoint from 'endpoint/json';
import UpdateNodeOperation, { Input, ChangeInput } from 'operation/update-node';

class JsonUpdateNodeEndpoint extends JsonEndpoint {
	protected async process(): Promise<Node> {
		const namespace_key = this.getUrlParameter('namespace_key');
		const type_key = this.getUrlParameter('type_key');
		const key = this.getUrlParameter('key');
		const body = this.getRequestBody() as Partial<Input>;
		const changes = body.changes as ChangeInput[];

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
