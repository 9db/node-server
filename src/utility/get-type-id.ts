import Node from 'type/node';
import getNodeParameters from 'utility/get-node-parameters';

function getTypeId(node: Node): string {
	const node_parameters = getNodeParameters(node);

	return node_parameters.type_id;
}

export default getTypeId;
