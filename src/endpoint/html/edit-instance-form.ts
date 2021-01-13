import TypeNode from 'type/type-node';
import FieldInput from 'template/page/create-instance-form/type/field-input';
import HtmlEndpoint from 'endpoint/html';
import InstanceNode from 'type/instance-node';
import getFieldKeys from 'utility/get-field-keys';
import BadRequestError from 'http/error/bad-request';
import EditInstanceFormTemplate from 'template/page/edit-instance-form';
import FetchTypeInstancesOperation from 'operation/fetch-type-instances';

interface Input {
	readonly fields: Record<string, string> | undefined;
}

class EditInstanceFormEndpoint extends HtmlEndpoint<Input> {
	protected async process(): Promise<string> {
		const instance = await this.fetchInstance();

		await this.checkPermission(instance);

		const type_node = await this.fetchType();
		const fields = await this.prepareFieldInputs(instance, type_node);

		return this.renderFormForInstance(instance, fields);
	}

	protected fetchInstance(): Promise<InstanceNode> {
		const type_id = this.getTypeId();
		const instance_id = this.getInstanceId();

		return super.fetchInstance(type_id, instance_id);
	}

	protected fetchType(): Promise<TypeNode> {
		const type_id = this.getQueryParameter('type_id');

		return super.fetchType(type_id);
	}

	private getTypeId(): string {
		const type_id = this.getQueryParameter('type_id');

		if (type_id === undefined) {
			throw new BadRequestError('Must specify a "type_id" query parameter');
		}

		return type_id;
	}

	private getInstanceId(): string {
		const instance_id = this.getQueryParameter('instance_id');

		if (instance_id === undefined) {
			throw new BadRequestError(
				'Must specify an "instance_id" query parameter'
			);
		}

		return instance_id;
	}

	private checkPermission(instance: InstanceNode): Promise<void> {
		return Promise.resolve();
	}

	private prepareFieldInputs(
		instance: InstanceNode,
		type_node: TypeNode
	): Promise<FieldInput[]> {
		const field_keys = getFieldKeys(type_node);

		const promises = field_keys.map((field_key) => {
			const type_url = type_node[field_key];

			if (typeof type_url !== 'string') {
				throw new BadRequestError(`
					Invalid type url: ${type_url} (expected string)
				`);
			}

			return this.prepareFieldInputForKey(field_key, instance, type_url);
		});

		return Promise.all(promises);
	}

	private async prepareFieldInputForKey(
		key: string,
		instance: InstanceNode,
		type_url: string
	): Promise<FieldInput> {
		const type_node = await this.loadTypeFromUrl(type_url);
		const instance_list = await this.fetchInstanceListForTypeNode(type_node);
		const draft_value = this.getDraftValueForFieldKey(key, instance);

		return {
			key,
			type_node,
			instance_list,
			draft_value
		};
	}

	private fetchInstanceListForTypeNode(
		type_node: TypeNode
	): Promise<InstanceNode[]> {
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			type_node,
			repository,
			account
		};

		const operation = new FetchTypeInstancesOperation(input);

		return operation.perform();
	}

	private getDraftValueForFieldKey(
		field_key: string,
		instance: InstanceNode
	): string {
		const value = instance[field_key];

		if (value === null) {
			return '';
		}

		return value.toString();
	}

	private renderFormForInstance(
		instance: InstanceNode,
		fields: FieldInput[]
	): string {
		const account = this.getAccount();

		const template = new EditInstanceFormTemplate({
			instance,
			fields,
			account
		});

		return template.render();
	}
}

export default EditInstanceFormEndpoint;
