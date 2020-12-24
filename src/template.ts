import Node from 'type/node';
import standardizeIndentation from 'template/utility/standardize-indentation';

abstract class Template<Input> {
	private input: Input;

	public constructor(input: Input) {
		this.input = input;
	}

	public render(): string {
		const html = this.getHtml();

		return standardizeIndentation(html);
	}

	protected getInput(): Input {
		return this.input;
	}

	protected buildNodeUrl(node: Node): string {
		return this.buildUrl(node.type_id, node.id);
	}

	protected buildUrl(type_id: string, node_id: string): string {
		return `/${type_id}/${node_id}`;
	}

	protected abstract getHtml(): string;
}

export default Template;