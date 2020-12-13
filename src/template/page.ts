import Template from 'template';

abstract class PageTemplate extends Template {
	protected getHtml(): string {
		const document_title = this.getDocumentTitle();
		const header_html = this.getHeaderHtml();
		const content_title = this.getContentTitle();
		const content_html = this.getContentHtml();

		return `
			<!DOCTYPE html>
			<html>
				<head>
					<title>${document_title}</title>
					<link rel="stylesheet" type="text/css" href="/site.css" media="screen"/>
				</head>
				<body>
					<header>
						${header_html}
					</header>

					<hr />

					<main>
						<h1>${content_title}</h1>
						${content_html}
					</main>
				</body>
			</html>
		`;
	}

	protected getDocumentTitle(): string {
		return this.getContentTitle();
	}

	protected abstract getHeaderHtml(): string;
	protected abstract getContentTitle(): string;
	protected abstract getContentHtml(): string;
}

export default PageTemplate;
