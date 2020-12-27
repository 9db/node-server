import Node from 'type/node';
import NodeParameters from 'type/node-parameters';
import getNodeParametersForUrl from 'utility/get-node-parameters-for-url';

function getNodeParameters(node: Node): NodeParameters {
	return getNodeParametersForUrl(node.url);
}

export default getNodeParameters;
