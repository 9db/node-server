import Node from 'type/node';
import JsonEndpoint from 'endpoint/json';
import FetchNodeOperation from 'operation/fetch-node';

class JsonFetchNodeEndpoint extends JsonEndpoint<Record<string, never>> {
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

		const operation = new FetchNodeOperation(input);

		return operation.perform();
	}
}

export default JsonFetchNodeEndpoint;
