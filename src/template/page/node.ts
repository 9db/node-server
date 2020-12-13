import PageTemplate from 'template/page';

class NodePageTemplate extends PageTemplate {
	protected getContentTitle(): string {
		return 'Node';
	}

	protected getHeaderHtml(): string {
		return 'xxx';
	}

	protected getContentHtml(): string {
		return `
			Some node
		`;
	}
}

export default NodePageTemplate;
