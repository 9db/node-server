import Node from 'type/node';
import getNodeParameters from 'utility/get-node-parameters';

function getNodeId(node: Node): string {
	const parameters = getNodeParameters(node);

	return parameters.id;
}

export default getNodeId;
