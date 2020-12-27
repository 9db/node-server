import InstanceNode from 'type/instance-node';
import JsonEndpoint from 'endpoint/json';
import FetchNodeOperation from 'operation/fetch-node';

class JsonFetchInstanceEndpoint extends JsonEndpoint<Record<string, never>> {
	protected async process(): Promise<InstanceNode> {
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
		const node = await operation.perform();

		return node as InstanceNode;
	}
}

export default JsonFetchInstanceEndpoint;
