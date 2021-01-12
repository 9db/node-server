import TypeNode from 'type/type-node';
import SystemId from 'system/enum/id';
import ActionType from 'enum/action-type';
import DraftField from 'type/draft-field';
import HtmlEndpoint from 'endpoint/html';
import BadRequestError from 'http/error/bad-request';
import TypeFormTemplate from 'template/page/type-form';
import FetchTypeInstancesOperation from 'operation/fetch-type-instances';
import CheckNodePermissionOperation from 'operation/check-node-permission';

interface DraftFieldInput {
	readonly key: string | undefined;
	readonly value: string | string[] | undefined;
}

interface Input {
	readonly id: string | undefined;
	readonly fields: DraftFieldInput[] | undefined;
}

class HtmlCreateTypeFormEndpoint extends HtmlEndpoint<Input> {
	protected async process(): Promise<string> {
		const generic_type = await this.fetchType(SystemId.GENERIC_TYPE);

		await this.checkPermission(generic_type);

		const type_nodes = await this.fetchTypeNodes(generic_type);

		return this.renderFormForTypeNode(generic_type, type_nodes);
	}

	private checkPermission(node: TypeNode): Promise<void> {
		const action_type = ActionType.CREATE;
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			node,
			action_type,
			repository,
			account
		};

		const operation = new CheckNodePermissionOperation(input);

		return operation.perform();
	}

	private async fetchTypeNodes(type_node: TypeNode): Promise<TypeNode[]> {
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			type_node,
			repository,
			account
		};

		const operation = new FetchTypeInstancesOperation(input);
		const result = await operation.perform();

		return result as TypeNode[];
	}

	private renderFormForTypeNode(
		generic_type: TypeNode,
		type_nodes: TypeNode[]
	): string {
		const account = this.getAccount();
		const draft_id = this.getDraftId();
		const draft_fields = this.getDraftFields();

		const template = new TypeFormTemplate({
			generic_type,
			draft_id,
			draft_fields,
			type_nodes,
			account
		});

		return template.render();
	}

	private getDraftFields(): DraftField[] {
		const body = this.getRequestBody();

		if (body.fields === undefined) {
			return [
				{
					key: '',
					value: ''
				}
			];
		}

		const draft_fields = body.fields.map((field) => {
			const key = field.key || '';

			let value: string | undefined;

			if (Array.isArray(field.value)) {
				value = field.value.find((element) => {
					return element !== '';
				});
			} else {
				value = field.value;
			}

			value ||= '';

			return {
				key,
				value
			};
		});

		const action = this.getQueryParameter('action');

		if (action === undefined) {
			return draft_fields;
		}

		switch (action) {
			case 'add_field':
				return this.processAddFieldAction(draft_fields);
			case 'remove_field':
				return this.processRemoveFieldAction(draft_fields);
			case undefined:
				return draft_fields;
			default:
				throw new BadRequestError(`
					Unsupported action: "${action}"
					(expected one of "add_field" or "remove_field")
				`);
		}
	}

	private processAddFieldAction(draft_fields: DraftField[]): DraftField[] {
		return [
			...draft_fields,
			{
				key: '',
				value: ''
			}
		];
	}

	private processRemoveFieldAction(draft_fields: DraftField[]): DraftField[] {
		const index_param = this.getQueryParameter('index');

		if (index_param === undefined) {
			throw new BadRequestError('Must supply an "index" query parameter');
		}

		const removal_index = parseInt(index_param, 10);

		if (isNaN(removal_index)) {
			throw new BadRequestError(`Invalid removal index: ${index_param}`);
		}

		return draft_fields.filter((_field, index) => {
			return index !== removal_index;
		});
	}

	private getDraftId(): string {
		const request_body = this.getRequestBody();

		return request_body.id || '';
	}
}

export default HtmlCreateTypeFormEndpoint;
