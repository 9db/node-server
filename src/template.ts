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
		return this.buildUrl(node.type_key, node.key);
	}

	protected buildUrl(
		type_key: string,
		node_key: string
	): string {
		return `/${type_key}/${node_key}`;
	}

	protected abstract getHtml(): string;
}

export default Template;
