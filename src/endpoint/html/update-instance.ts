import InstanceNode from 'type/instance-node';
import HtmlEndpoint from 'endpoint/html';

interface Input {}

class HtmlUpdateInstanceEndpoint extends HtmlEndpoint<Input> {
	protected async process(): Promise<void> {
		const instance = await this.fetchInstance();

		this.redirectToUrl(instance.url);
	}

	protected fetchInstance(): Promise<InstanceNode> {
		const type_id = this.getTypeId();
		const instance_id = this.getInstanceId();

		return super.fetchInstance(type_id, instance_id);
	}

	private getTypeId(): string {
		return this.getUrlParameter('type_id');
	}

	private getInstanceId(): string {
		return this.getUrlParameter('instance_id');
	}
}

export default HtmlUpdateInstanceEndpoint;
