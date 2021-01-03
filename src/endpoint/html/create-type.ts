import DraftField from 'type/draft-field';
import HtmlEndpoint from 'endpoint/html';
import CreateTypeOperation from 'operation/create-type';

interface HtmlDraftField {
	readonly key: string;
	// Because of the way the HTML form is built, we will receive two values
	// rather than a single string. One of them will be empty.
	readonly value: string[];
}

interface Input {
	readonly id: string | undefined;
	readonly fields: HtmlDraftField[] | undefined;
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

		if (request_body.fields === undefined) {
			return [];
		}

		const html_fields = request_body.fields;

		return html_fields.map((html_field) => {
			const value = html_field.value.find((value) => {
				return value !== '';
			});

			return {
				key: html_field.key,
				value: value || ''
			};
		});
	}
}

export default HtmlCreateTypeEndpoint;
