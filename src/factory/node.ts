import Node from 'type/node';

function randomId(): string {
	return Math.random().toString(16).slice(2);
}

function randomCreator(): string {
	const key = randomId();

	return `https://9db.org/account/${key}`;
}

class NodeFactory {
	public static create(node?: Partial<Node>): Node {
		return {
			id: randomId(),
			type_id: randomId(),
			creator: randomCreator(),
			created_at: Date.now(),
			updated_at: Date.now(),
			changes: [],
			...node
		};
	}
}

export default NodeFactory;
