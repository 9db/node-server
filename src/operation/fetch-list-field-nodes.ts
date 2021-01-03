import Node from 'type/node';
import LoadNodeFromUrlOperation from 'operation/load-node-from-url';
import Operation, { OperationInput } from 'operation';
import FetchListFieldValuesOperation from 'operation/fetch-list-field-values';

interface Input extends OperationInput {
	readonly node: Node;
	readonly field_key: string;
	readonly offset?: number;
	readonly limit?: number;
}

class FetchListFieldNodesOperation extends Operation<Input, Node[]> {
	protected async performInternal(): Promise<Node[]> {
		const urls = await this.fetchListUrls();

		const promises = urls.map((url) => {
			return this.fetchNodeForUrl(url);
		});

		return Promise.all(promises);
	}

	private async fetchListUrls(): Promise<string[]> {
		const input = this.getInput();
		const operation = new FetchListFieldValuesOperation(input);
		const values = await operation.perform();

		return values as string[];
	}

	private fetchNodeForUrl(url: string): Promise<Node> {
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			url,
			repository,
			account
		};

		const operation = new LoadNodeFromUrlOperation(input);

		return operation.perform();
	}
}

export default FetchListFieldNodesOperation;
