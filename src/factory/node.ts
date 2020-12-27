import Node from 'type/node';
import KeyGenerator from 'utility/key-generator';
import buildNodeUrl from 'utility/build-node-url';

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
		const url = buildNodeUrl(HOSTNAME, {
			id,
			type_id
		});

		return {
			url,
			creator: randomCreatorUrl(),
			created_at: Date.now(),
			updated_at: Date.now(),
			changes: randomChangesUrl(),
			...node
		};
	}
}

export default NodeFactory;
