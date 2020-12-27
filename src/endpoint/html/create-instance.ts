import DraftField from 'type/draft-field';
import HtmlEndpoint from 'endpoint/html';
import CreateInstanceOperation from 'operation/create-instance';

interface Input {
	readonly id: string | undefined;
	readonly fields: DraftField[] | undefined;
}

class HtmlCreateInstanceEndpoint extends HtmlEndpoint<Input> {
	protected async process(): Promise<void> {
		const id = this.getId();
		const type_id = this.getTypeId();
		const fields = this.getDraftFields();
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			id,
			type_id,
			fields,
			repository,
			account
		};

		const operation = new CreateInstanceOperation(input);
		const node = await operation.perform();

		this.redirectToUrl(node.url);
	}

	private getId(): string {
		const request_body = this.getRequestBody();

		return request_body.id || '';
	}

	private getTypeId(): string {
		return this.getUrlParameter('type_id');
	}

	private getDraftFields(): DraftField[] {
		const request_body = this.getRequestBody();

		return request_body.fields || [];
	}
}

export default HtmlCreateInstanceEndpoint;
