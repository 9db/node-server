import Node from 'type/node';
import JsonEndpoint from 'endpoint/json';
import CreateNodeOperation from 'operation/create-node';

class JsonCreateNodeEndpoint extends JsonEndpoint<Node> {
	protected async process(): Promise<Node> {
		const type_key = this.getUrlParameter('type_key');
		const key = this.getUrlParameter('key');
		const body = this.getRequestBody();

		const node = {
			...body,
			type_key,
			key
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
