import Node from 'type/node';

function getTypeId(node: Node): string {
	return node.type_id;
}

export default getTypeId;
