import Node from 'type/node';
import HtmlEndpoint from 'endpoint/html';
import NodePageTemplate from 'template/page/node';
import FetchNodeOperation from 'operation/fetch-node';

class HtmlNodePageEndpoint extends HtmlEndpoint<Record<string, never>> {
	protected async process(): Promise<string> {
		const node = await this.fetchNode();

		return this.renderNode(node);
	}

	private fetchNode(): Promise<Node> {
		const namespace_key = this.getUrlParameter('namespace_key');
		const type_key = this.getUrlParameter('type_key');
		const key = this.getUrlParameter('key');

		const input = {
			namespace_key,
			type_key,
			key
		};

		const repository = this.getRepository();
		const operation = new FetchNodeOperation(repository, input);

		return operation.perform();
	}

	private renderNode(node: Node): string {
		const account = this.getAccount();

		const template = new NodePageTemplate({
			node,
			type_nodes: [],
			account
		});

		return template.render();
	}
}

export default HtmlNodePageEndpoint;
