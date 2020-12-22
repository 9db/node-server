import Node from 'type/node';
import JsonEndpoint from 'endpoint/json';
import CreateNodeOperation from 'operation/create-node';

class JsonCreateNodeEndpoint extends JsonEndpoint<Node> {
	protected async process(): Promise<Node> {
		const id = this.getUrlParameter('id');
		const type_id = this.getUrlParameter('type_id');
		const body = this.getRequestBody();

		const node = {
			...body,
			id,
			type_id
		};

		const repository = this.getRepository();
		const account = this.getAccount();

		const operation = new CreateNodeOperation({
			node,
			repository,
			account
		});

		return operation.perform();
	}
}

export default JsonCreateNodeEndpoint;
