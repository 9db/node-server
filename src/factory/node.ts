import Node from 'type/node';

function randomKey(): string {
	return Math.random().toString(16).slice(2);
}

class NodeFactory {
	public static create(node?: Partial<Node>): Node {
		return {
			namespace_key: randomKey(),
			type_key: randomKey(),
			key: randomKey(),
			...node,
		};
	}
}

export default NodeFactory;
