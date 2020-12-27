import Node from 'type/node';
import KeyGenerator from 'utility/key-generator';

const HOSTNAME = 'https://9db.org';

function randomCreatorUrl(): string {
	const id = KeyGenerator.id();

	return `${HOSTNAME}/account/${id}`;
}

function randomChangesUrl(): string {
	const id = KeyGenerator.id();

	return `${HOSTNAME}/change-list/${id}`;
}

class NodeFactory {
	public static create(node?: Partial<Node>): Node {
		const id = KeyGenerator.id();
		const type_id = KeyGenerator.id();
		const url = `${HOSTNAME}/${type_id}/${id}`;

		return {
			url,
			id,
			type_id,
			creator: randomCreatorUrl(),
			created_at: Date.now(),
			updated_at: Date.now(),
			changes: randomChangesUrl(),
			...node
		};
	}
}

export default NodeFactory;
