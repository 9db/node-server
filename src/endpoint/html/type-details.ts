import Node from 'type/node';
import SystemId from 'system/enum/id';
import HtmlEndpoint from 'endpoint/html';
import FetchNodeOperation from 'operation/fetch-node';
import NodeDetailsTemplate from 'template/page/node-details';

class HtmlTypeDetailsEndpoint extends HtmlEndpoint<Record<string, never>> {
	protected async process(): Promise<string> {
		const node = await this.fetchNode();

		return this.renderNode(node);
	}

	private fetchNode(): Promise<Node> {
		const id = this.getUrlParameter('type_id');
		const type_id = SystemId.GENERIC_TYPE;
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

		const template = new NodeDetailsTemplate({
			node,
			type_nodes: [],
			account
		});

		return template.render();
	}
}

export default HtmlTypeDetailsEndpoint;
