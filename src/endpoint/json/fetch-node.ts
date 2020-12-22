import Node from 'type/node';
import JsonEndpoint from 'endpoint/json';
import FetchNodeOperation from 'operation/fetch-node';

class JsonFetchNodeEndpoint extends JsonEndpoint<Record<string, never>> {
	protected async process(): Promise<Node> {
		const type_key = this.getUrlParameter('type_key');
		const key = this.getUrlParameter('key');
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			type_key,
			key,
			repository,
			account
		};

		const operation = new FetchNodeOperation(input);

		return operation.perform();
	}
}

export default JsonFetchNodeEndpoint;
