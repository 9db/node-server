import Node from 'type/node';
import Operation, { OperationInput } from 'operation';
import NotFoundError from 'http/error/not-found';

interface Input extends OperationInput {
	readonly url: string;
}

class LoadNodeFromUrlOperation extends Operation<Input, Node> {
	protected performInternal(): Promise<Node> {
		if (this.isLocalNode()) {
			return this.loadLocalNode();
		} else {
			return this.loadRemoteNode();
		}
	}

	private async loadLocalNode(): Promise<Node> {
		const repository = this.getRepository();
		const url = this.getUrl();
		const node_parameters = repository.getNodeParametersForUrl(url);

		if (node_parameters === undefined) {
			throw new Error(`Invalid local node url: ${url}`);
		}

		const node = await repository.fetchNode(
			node_parameters.type_id,
			node_parameters.id
		);

		if (node === undefined) {
			throw new NotFoundError();
		}

		return node;
	}

	private loadRemoteNode(): Promise<Node> {
		throw new Error('not implemented');
	}

	private isLocalNode(): boolean {
		const url = this.getUrl();
		const repository = this.getRepository();

		return repository.isLocalUrl(url);
	}

	private getUrl(): string {
		const input = this.getInput();

		return input.url;
	}
}

export default LoadNodeFromUrlOperation;