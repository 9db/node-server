import Node from 'type/node';
import NodeFactory from 'factory/node';
import JsonEndpoint from 'endpoint/json';

class JsonFetchNodeEndpoint extends JsonEndpoint {
	protected process(): Promise<Node> {
		const namespace_key = this.getUrlParameter('namespace_key');
		const type_key = this.getUrlParameter('type_key');
		const key = this.getUrlParameter('key');

		const node = NodeFactory.create({
			namespace_key,
			type_key,
			key,
		});

		return Promise.resolve(node);
	}
}

export default JsonFetchNodeEndpoint;
