import Node from 'type/node';
import GenericTypeGenerator from 'system/node-generator/type/generic';
import AccountTypeGenerator from 'system/node-generator/type/account';
import SystemAccountGenerator from 'system/node-generator/account/system';
import { GeneratorConstructor } from 'system/node-generator';
import AnonymousAccountGenerator from 'system/node-generator/account/anonymous';

const GENERATORS: GeneratorConstructor[] = [
	GenericTypeGenerator,
	AccountTypeGenerator,
	SystemAccountGenerator,
	AnonymousAccountGenerator
];

interface NodeCache {
	[composite_key: string]: Node;
}

class SystemCache {
	private hostname: string;
	private nodes: NodeCache;

	public constructor(hostname: string) {
		this.hostname = hostname;
		this.nodes = {};
		this.generateNodes();
	}

	public fetchNode(
		type_key: string,
		node_key: string
	): Node | undefined {
		const cache_key = this.buildCacheKey(type_key, node_key);
		const nodes = this.getNodes();

		return nodes[cache_key];
	}

	private generateNodes(): void {
		const hostname = this.getHostname();

		GENERATORS.forEach((generator_constructor) => {
			const generator = new generator_constructor(hostname);
			const node = generator.generate();

			this.addNode(node);
		});
	}

	private addNode(node: Node): void {
		const cache_key = this.buildCacheKey(
			node.type_key,
			node.key
		);

		const nodes = this.getNodes();

		nodes[cache_key] = node;
	}

	private buildCacheKey(
		type_key: string,
		node_key: string
	): string {
		return `${type_key}/${node_key}`;
	}

	private getHostname(): string {
		return this.hostname;
	}

	private getNodes(): NodeCache {
		return this.nodes;
	}
}

export default SystemCache;
