import Node from 'type/node';

function randomKey(): string {
	return Math.random().toString(16).slice(2);
}

function randomCreator(): string {
	const key = randomKey();

	return `https://9db.org/public/account/${key}`;
}

class NodeFactory {
	public static create(node?: Partial<Node>): Node {
		return {
			namespace_key: randomKey(),
			type_key: randomKey(),
			key: randomKey(),
			creator: randomCreator(),
			created_at: Date.now(),
			updated_at: Date.now(),
			...node
		};
	}
}

export default NodeFactory;
