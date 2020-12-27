import DraftField from 'type/draft-field';
import HtmlEndpoint from 'endpoint/html';
import CreateTypeOperation from 'operation/create-type';

interface Input {
	readonly id: string | undefined;
	readonly fields: DraftField[] | undefined;
}

class HtmlCreateTypeEndpoint extends HtmlEndpoint<Input> {
	protected async process(): Promise<void> {
		const id = this.getId();
		const fields = this.getDraftFields();
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			id,
			fields,
			repository,
			account
		};

		const operation = new CreateTypeOperation(input);
		const node = await operation.perform();

		this.redirectToUrl(node.url);
	}

	private getId(): string {
		const request_body = this.getRequestBody();

		return request_body.id || '';
	}

	private getDraftFields(): DraftField[] {
		const request_body = this.getRequestBody();

		return request_body.fields || [];
	}
}

export default HtmlCreateTypeEndpoint;
