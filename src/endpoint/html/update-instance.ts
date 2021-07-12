import InstanceNode from 'type/instance-node';
import HtmlEndpoint from 'endpoint/html';
import UpdateNodeOperation, { ChangeInput } from 'operation/update-node';

interface Input {}

class HtmlUpdateInstanceEndpoint extends HtmlEndpoint<Input> {
	protected async process(): Promise<void> {
		const instance = await this.applyChanges();

		this.redirectToUrl(instance.url);
	}

	private getTypeId(): string {
		return this.getUrlParameter('type_id');
	}

	private getInstanceId(): string {
		return this.getUrlParameter('instance_id');
	}

	private buildChangeInputs(): ChangeInput[] {
		return [];
	}

	private async applyChanges(): Promise<InstanceNode> {
		const id = this.getInstanceId();
		const type_id = this.getTypeId();
		const changes = this.buildChangeInputs();
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			id,
			type_id,
			changes,
			repository,
			account
		};

		const operation = new UpdateNodeOperation(input);
		const node = await operation.perform();

		return node as InstanceNode;
	}

	/*
	private getDraftFields(): DraftField[] {
		const request_body = this.getRequestBody();

		return request_body.fields || [];
	}
	*/
}

export default HtmlUpdateInstanceEndpoint;
