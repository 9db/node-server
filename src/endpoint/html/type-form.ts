import Node from 'type/node';
import SystemKey from 'system/enum/key';
import HtmlEndpoint from 'endpoint/html';
import TypeFormTemplate from 'template/page/type-form';
import FetchNodeOperation from 'operation/fetch-node';

class HtmlTypeFormEndpoint extends HtmlEndpoint<Record<string, never>> {
	protected async process(): Promise<string> {
		const type_node = await this.fetchTypeNode();

		return this.renderFormForTypeNode(type_node);
	}

	private fetchTypeNode(): Promise<Node> {
		const namespace_key = this.getUrlParameter('namespace_key');
		const type_key = SystemKey.GENERIC_TYPE;
		const key = SystemKey.GENERIC_TYPE;
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			namespace_key,
			type_key,
			key,
			repository,
			account
		};

		const operation = new FetchNodeOperation(input);

		return operation.perform();
	}

	private renderFormForTypeNode(node: Node): string {
		const account = this.getAccount();

		const template = new TypeFormTemplate({
			node,
			account
		});

		return template.render();
	}
}

export default HtmlTypeFormEndpoint;
