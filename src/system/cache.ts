import Node from 'type/node';
import StringTypeGenerator from 'system/node-generator/type/string';
import GenericTypeGenerator from 'system/node-generator/type/generic';
import AccountTypeGenerator from 'system/node-generator/type/account';
import SystemAccountGenerator from 'system/node-generator/account/system';
import { GeneratorConstructor } from 'system/node-generator';
import AnonymousAccountGenerator from 'system/node-generator/account/anonymous';

const GENERATORS: GeneratorConstructor[] = [
	StringTypeGenerator,
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

	public fetchNode(type_id: string, node_id: string): Node | undefined {
		const cache_key = this.buildCacheKey(type_id, node_id);
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
		const cache_key = this.buildCacheKey(node.type_id, node.id);

		const nodes = this.getNodes();

		nodes[cache_key] = node;
	}

	private buildCacheKey(type_id: string, node_id: string): string {
		return `${type_id}/${node_id}`;
	}

	private getHostname(): string {
		return this.hostname;
	}

	private getNodes(): NodeCache {
		return this.nodes;
	}
}

export default SystemCache;
