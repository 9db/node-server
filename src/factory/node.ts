import Node from 'type/node';
import KeyGenerator from 'utility/key-generator';

function randomCreatorUrl(): string {
	const id = KeyGenerator.id();

	return `https://9db.org/account/${id}`;
}

function randomChangesUrl(): string {
	const id = KeyGenerator.id();

	return `https://9db.org/change-list/${id}`;
}

class NodeFactory {
	public static create(node?: Partial<Node>): Node {
		return {
			id: KeyGenerator.id(),
			type_id: KeyGenerator.id(),
			creator: randomCreatorUrl(),
			created_at: Date.now(),
			updated_at: Date.now(),
			changes: randomChangesUrl(),
			...node
		};
	}
}

export default NodeFactory;
