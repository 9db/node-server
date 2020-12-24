import Node from 'type/node';
import JsonEndpoint from 'endpoint/json';
import FetchInstanceOperation from 'operation/fetch-node';

class JsonFetchInstanceEndpoint extends JsonEndpoint<Record<string, never>> {
	protected async process(): Promise<Node> {
		const id = this.getUrlParameter('id');
		const type_id = this.getUrlParameter('type_id');
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			id,
			type_id,
			repository,
			account
		};

		const operation = new FetchInstanceOperation(input);

		return operation.perform();
	}
}

export default JsonFetchInstanceEndpoint;
