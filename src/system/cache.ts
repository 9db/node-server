import Node from 'type/node';
import GenericTypeGenerator from 'system/node-generator/type/generic';
import AccountTypeGenerator from 'system/node-generator/type/account';
import NamespaceTypeGenerator from 'system/node-generator/type/namespace';
import SystemAccountGenerator from 'system/node-generator/account/system';
import { GeneratorConstructor } from 'system/node-generator';
import SystemNamespaceGenerator from 'system/node-generator/namespace/system';
import AnonymousAccountGenerator from 'system/node-generator/account/anonymous';

const GENERATORS: GeneratorConstructor[] = [
	GenericTypeGenerator,
	AccountTypeGenerator,
	NamespaceTypeGenerator,
	SystemNamespaceGenerator,
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
		namespace_key: string,
		type_key: string,
		node_key: string
	): Node | undefined {
		const cache_key = this.buildCacheKey(namespace_key, type_key, node_key);
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
			node.namespace_key,
			node.type_key,
			node.key
		);

		const nodes = this.getNodes();

		nodes[cache_key] = node;
	}

	private buildCacheKey(
		namespace_key: string,
		type_key: string,
		node_key: string
	): string {
		return `${namespace_key}/${type_key}/${node_key}`;
	}

	private getHostname(): string {
		return this.hostname;
	}

	private getNodes(): NodeCache {
		return this.nodes;
	}
}

export default SystemCache;
