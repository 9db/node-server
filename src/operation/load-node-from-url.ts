import Node from 'type/node';
import Operation from 'operation';
import Repository from 'repository';
import NotFoundError from 'http/error/not-found';

class LoadNodeFromUrlOperation extends Operation<Node> {
	private url: string;

	public constructor(repository: Repository, url: string) {
		super(repository);

		this.url = url;
	}

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
			node_parameters.namespace_key,
			node_parameters.type_key,
			node_parameters.key
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
		return this.url;
	}
}

export default LoadNodeFromUrlOperation;
