import Node from 'type/node';
import SystemId from 'system/enum/id';
import KeyGenerator from 'utility/key-generator';
import buildNodeUrl from 'utility/build-node-url';

const HOSTNAME = 'https://9db.org';

function randomCreatorUrl(): string {
	const id = KeyGenerator.id();

	return `${HOSTNAME}/${SystemId.ACCOUNT_TYPE}/${id}`;
}

function randomChangesUrl(): string {
	const id = KeyGenerator.id();

	return `${HOSTNAME}/${SystemId.CHANGE_LIST_TYPE}/${id}`;
}

function randomPermissionsUrl(): string {
	const id = KeyGenerator.id();

	return `${HOSTNAME}/${SystemId.PERMISSION_SET_TYPE}/${id}`;
}

class NodeFactory {
	public static create(node?: Partial<Node>): Node {
		const id = KeyGenerator.id();
		const type_id = KeyGenerator.id();

		const url = buildNodeUrl(HOSTNAME, {
			type_id,
			id
		});

		const type_url = buildNodeUrl(HOSTNAME, {
			type_id: SystemId.GENERIC_TYPE,
			id: type_id
		});

		return {
			url,
			type: type_url,
			creator: randomCreatorUrl(),
			created_at: Date.now(),
			updated_at: Date.now(),
			changes: randomChangesUrl(),
			permissions: randomPermissionsUrl(),
			...node
		};
	}
}

export default NodeFactory;
