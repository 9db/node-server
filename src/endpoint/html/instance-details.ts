import Node from 'type/node';
import HtmlEndpoint from 'endpoint/html';
import FetchNodeOperation from 'operation/fetch-node';
import InstanceDetailsTemplate from 'template/page/instance-details';

class HtmlInstanceDetailsEndpoint extends HtmlEndpoint<Record<string, never>> {
	protected async process(): Promise<string> {
		const node = await this.fetchNode();

		return this.renderNode(node);
	}

	private fetchNode(): Promise<Node> {
		const id = this.getUrlParameter('id');
		const type_id = this.getUrlParameter('type_id');
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			id,
			type_id,
			repository,
			account
		};

		const operation = new FetchNodeOperation(input);

		return operation.perform();
	}

	private renderNode(node: Node): string {
		const account = this.getAccount();

		const template = new InstanceDetailsTemplate({
			node,
			type_nodes: [],
			account
		});

		return template.render();
	}
}

export default HtmlInstanceDetailsEndpoint;
