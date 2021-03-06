import Template from 'template';
import AccountNode from 'type/node/account';
import getManifest from 'utility/get-manifest';
import AccountMenuTemplate from 'template/partial/account-menu';

export interface Breadcrumb {
	readonly label: string;
	readonly url?: string;
}

export interface PageTemplateInput {
	readonly account: AccountNode;
}

abstract class PageTemplate<T extends PageTemplateInput> extends Template<T> {
	protected getHtml(): string {
		const document_title = this.getDocumentTitle();
		const account_menu_html = this.getAccountMenuHtml();
		const breadcrumbs_html = this.getBreadcrumbsHtml();
		const content_title = this.getContentTitle();
		const content_html = this.getContentHtml();
		const footer_html = this.getFooterHtml();

		return `
			<!DOCTYPE html>
			<html>
				<head>
					<title>${document_title}</title>
					<link rel="stylesheet" type="text/css" href="/site.css" media="screen"/>
				</head>
				<body>
					<header>
						${account_menu_html}
						<nav>
							${breadcrumbs_html}
						</nav>
					</header>

					<hr />

					<main>
						<h1>${content_title}</h1>
						${content_html}
					</main>

					<hr />

					<footer>
						${footer_html}
					</footer>
				</body>
			</html>
		`;
	}

	protected getDocumentTitle(): string {
		return this.getContentTitle();
	}

	protected getAccount(): AccountNode {
		const input = this.getInput();

		return input.account;
	}

	private getAccountMenuHtml(): string {
		const account = this.getAccount();

		const template = new AccountMenuTemplate({
			account
		});

		return template.render();
	}

	private getBreadcrumbsHtml(): string {
		const breadcrumbs = this.getBreadcrumbs();

		const serialized_breadcrumbs = breadcrumbs.map((breadcrumb) => {
			return this.getBreadcrumbHtml(breadcrumb);
		});

		return serialized_breadcrumbs.join(`
			<em>&gt;</em>
		`);
	}

	private getBreadcrumbHtml(breadcrumb: Breadcrumb): string {
		if (breadcrumb.url === undefined) {
			return `<span>${breadcrumb.label}</span>`;
		}

		return `
			<a href="${breadcrumb.url}">
				${breadcrumb.label}
			</a>
		`;
	}

	private getFooterHtml(): string {
		const manifest = getManifest();
		const project_name = manifest.name;
		const version = manifest.version;

		let url: string;

		if (manifest.homepage !== undefined) {
			url = manifest.homepage;
		} else {
			url = `https://npmjs.com/package/${project_name}`;
		}

		return `
			<span>
				Running
				<a href="${url}">${project_name} v${version}</a>
			</span>
		`;
	}

	protected abstract getBreadcrumbs(): Breadcrumb[];
	protected abstract getContentTitle(): string;
	protected abstract getContentHtml(): string;
}

export default PageTemplate;
