import Node from 'type/node';
import JsonEndpoint from 'endpoint/json';
import FetchNodeOperation from 'operation/fetch-node';

class JsonFetchNodeEndpoint extends JsonEndpoint {
	protected async process(): Promise<Node> {
		const namespace_key = this.getUrlParameter('namespace_key');
		const type_key = this.getUrlParameter('type_key');
		const key = this.getUrlParameter('key');

		const input = {
			namespace_key,
			type_key,
			key
		};

		const operation = new FetchNodeOperation(input);

		return operation.perform();
	}
}

export default JsonFetchNodeEndpoint;
