import standardizeIndentation from 'template/utility/standardize-indentation';

abstract class Template {
	public render(): string {
		const html = this.getHtml();

		return standardizeIndentation(html);
	}

	protected abstract getHtml(): string;
}

export default Template;
