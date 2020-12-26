import Node from 'type/node';
import SystemId from 'system/enum/id';
import DraftField from 'type/draft-field';
import HtmlEndpoint from 'endpoint/html';
import BadRequestError from 'http/error/bad-request';
import TypeFormTemplate from 'template/page/type-form';
import FetchNodeOperation from 'operation/fetch-node';

interface Input {
	readonly id: string | undefined;
	readonly fields: DraftField[] | undefined;
}

class HtmlTypeFormEndpoint extends HtmlEndpoint<Input> {
	protected async process(): Promise<string> {
		const type_node = await this.fetchTypeNode();

		return this.renderFormForTypeNode(type_node);
	}

	private fetchTypeNode(): Promise<Node> {
		const id = SystemId.GENERIC_TYPE;
		const type_id = SystemId.GENERIC_TYPE;
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			id,
			type_id,
			repository,
			account
		};

		const operation = new FetchNodeOperation(input);

		return operation.perform();
	}

	private renderFormForTypeNode(node: Node): string {
		const account = this.getAccount();
		const draft_id = this.getDraftId();
		const draft_fields = this.getDraftFields();

		const template = new TypeFormTemplate({
			node,
			draft_id,
			draft_fields,
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

		const draft_fields = body.fields;
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
				throw new BadRequestError();
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
			throw new BadRequestError();
		}

		const removal_index = parseInt(index_param, 10);

		if (isNaN(removal_index)) {
			throw new BadRequestError();
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

export default HtmlTypeFormEndpoint;
