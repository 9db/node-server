import InstanceNode from 'type/instance-node';
import JsonEndpoint from 'endpoint/json';

class JsonFetchInstanceEndpoint extends JsonEndpoint<Record<string, never>> {
	protected async process(): Promise<InstanceNode> {
		const type_id = this.getUrlParameter('type_id');
		const id = this.getUrlParameter('id');

		return this.fetchInstance(type_id, id);
	}
}

export default JsonFetchInstanceEndpoint;
