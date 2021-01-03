import Template from 'template';
import TypeNode from 'type/type-node';
import DraftField from 'type/draft-field';
import getNodeParameters from 'utility/get-node-parameters';

interface Input {
	readonly draft_field: DraftField;
	readonly index: number;
	readonly type_nodes: TypeNode[];
}

class FieldRowTemplate extends Template<Input> {
	protected getHtml(): string {
		const display_index_html = this.getDisplayIndexHtml();
		const key_html = this.getKeyHtml();
		const type_list_html = this.getTypeListHtml();
		const explicit_type_html = this.getExplicitTypeHtml();
		const remove_row_html = this.getRemoveRowHtml();

		return `
			<tr>
				<td>
					${display_index_html}
				</td>
				<td>
					${key_html}
				</td>
				<td>
					${type_list_html}
				</td>
				<td>
					${explicit_type_html}
				</td>
				<td>
					${remove_row_html}
				</td>
			</tr>
		`;
	}

	private getDisplayIndexHtml(): string {
		const index = this.getIndex();
		const display_index = index + 1;

		return `
			${display_index}
		`;
	}

	private getKeyHtml(): string {
		const index = this.getIndex();
		const key = this.getKey();

		return `
			<input name="fields[${index}][key]" value="${key}" />
		`;
	}

	private getTypeListHtml(): string {
		const index = this.getIndex();
		const type_options_html = this.getTypeOptionsHtml();

		return `
			<select name="fields[${index}][value]">
				${type_options_html}
			</select>
		`;
	}

	private getTypeOptionsHtml(): string {
		const type_nodes = this.getTypeNodes();

		const serialized_options: string[] = [
			`
				<option disabled selected value>
					Select an existing type
				</option>
			`
		];

		type_nodes.forEach((type_node) => {
			const url = type_node.url;
			const parameters = getNodeParameters(url);
			const id = parameters.id;

			serialized_options.push(`
				<option value="${url}">${id}</option>
			`);
		});

		return serialized_options.join('\n');
	}

	private getExplicitTypeHtml(): string {
		const index = this.getIndex();
		const value = this.getValue();

		return `
			<input name="fields[${index}][value]" value="${value}" />
		`;
	}

	private getRemoveRowHtml(): string {
		const index = this.getIndex();

		return `
			<input type="submit" formaction="/type/new?action=remove_field&index=${index}" formmethod="POST" value="x" />
		`;
	}

	private getKey(): string {
		const draft_field = this.getDraftField();

		return draft_field.key;
	}

	private getValue(): string {
		const draft_field = this.getDraftField();

		return draft_field.value;
	}

	private getDraftField(): DraftField {
		const input = this.getInput();

		return input.draft_field;
	}

	private getIndex(): number {
		const input = this.getInput();

		return input.index;
	}

	private getTypeNodes(): TypeNode[] {
		const input = this.getInput();

		return input.type_nodes;
	}
}

export default FieldRowTemplate;
