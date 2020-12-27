import TypeNode from 'type/type-node';
import SystemId from 'system/enum/id';
import HtmlEndpoint from 'endpoint/html';
import FetchNodeOperation from 'operation/fetch-node';
import TypeDetailsTemplate from 'template/page/type-details';

class HtmlTypeDetailsEndpoint extends HtmlEndpoint<Record<string, never>> {
	protected async process(): Promise<string> {
		const node = await this.fetchNode();

		return this.renderNode(node);
	}

	private async fetchNode(): Promise<TypeNode> {
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
		const node = await operation.perform();

		return node as TypeNode;
	}

	private renderNode(node: TypeNode): string {
		const account = this.getAccount();

		const template = new TypeDetailsTemplate({
			node,
			type_nodes: [],
			account
		});

		return template.render();
	}
}

export default HtmlTypeDetailsEndpoint;
