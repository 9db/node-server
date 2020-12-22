import Node from 'type/node';
import HtmlEndpoint from 'endpoint/html';
import FetchNodeOperation from 'operation/fetch-node';
import NodeDetailsTemplate from 'template/page/node-details';

class HtmlNodeDetailsEndpoint extends HtmlEndpoint<Record<string, never>> {
	protected async process(): Promise<string> {
		const node = await this.fetchNode();

		return this.renderNode(node);
	}

	private fetchNode(): Promise<Node> {
		const type_key = this.getUrlParameter('type_key');
		const key = this.getUrlParameter('key');
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			type_key,
			key,
			repository,
			account
		};

		const operation = new FetchNodeOperation(input);

		return operation.perform();
	}

	private renderNode(node: Node): string {
		const account = this.getAccount();

		const template = new NodeDetailsTemplate({
			node,
			type_nodes: [],
			account
		});

		return template.render();
	}
}

export default HtmlNodeDetailsEndpoint;
