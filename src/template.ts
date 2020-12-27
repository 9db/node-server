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

	protected abstract getHtml(): string;
}

export default Template;
