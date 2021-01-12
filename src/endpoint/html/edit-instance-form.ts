import HtmlEndpoint from 'endpoint/html';
import InstanceNode from 'type/instance-node';
import BadRequestError from 'http/error/bad-request';
import EditInstanceFormTemplate from 'template/page/edit-instance-form';

interface Input {
	readonly fields: Record<string, string> | undefined;
}

class EditInstanceFormEndpoint extends HtmlEndpoint<Input> {
	protected async process(): Promise<string> {
		const instance = await this.fetchInstance();

		await this.checkPermission(instance);

		return this.renderFormForInstance(instance);
	}

	protected fetchInstance(): Promise<InstanceNode> {
		const type_id = this.getQueryParameter('type_id');

		if (type_id === undefined) {
			throw new BadRequestError('Must specify a "type_id" query parameter');
		}

		const instance_id = this.getQueryParameter('instance_id');

		if (instance_id === undefined) {
			throw new BadRequestError(
				'Must specify an "instance_id" query parameter'
			);
		}

		return super.fetchInstance(type_id, instance_id);
	}

	private checkPermission(instance: InstanceNode): Promise<void> {
		return Promise.resolve();
	}

	private renderFormForInstance(instance: InstanceNode): string {
		const account = this.getAccount();

		const template = new EditInstanceFormTemplate({
			instance,
			account
		});

		return template.render();
	}
}

export default EditInstanceFormEndpoint;
