import Node from 'type/node';
import NodeParameters from 'type/node-parameters';
import getListInnerType from 'utility/get-list-inner-type';
import ListNodeGenerator from 'system/node-generator/list';
import getNodeParameters from 'utility/get-node-parameters';
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

	public fetchNode(parameters: NodeParameters): Node | undefined {
		if (this.isListNode(parameters)) {
			return this.fetchListNode(parameters);
		}

		const cache_key = this.buildCacheKey(parameters);

		const nodes = this.getNodes();

		return nodes[cache_key];
	}

	private isListNode(parameters: NodeParameters): boolean {
		const inner_type = getListInnerType(parameters.type_id);

		return inner_type !== null;
	}

	private fetchListNode(parameters: NodeParameters): Node {
		const hostname = this.getHostname();
		const generator = new ListNodeGenerator(hostname, parameters);

		return generator.generate();
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
		const parameters = getNodeParameters(node.url);
		const cache_key = this.buildCacheKey(parameters);
		const nodes = this.getNodes();

		nodes[cache_key] = node;
	}

	private buildCacheKey(node_parameters: NodeParameters): string {
		return `${node_parameters.type_id}/${node_parameters.id}`;
	}

	private getHostname(): string {
		return this.hostname;
	}

	private getNodes(): NodeCache {
		return this.nodes;
	}
}

export default SystemCache;
