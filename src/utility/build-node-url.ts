import SystemId from 'system/enum/id';
import NodeParameters from 'type/node-parameters';

function buildNodeUrl(hostname: string, parameters: NodeParameters): string {
	const { type_id, id } = parameters;

	if (type_id === SystemId.GENERIC_TYPE) {
		return `${hostname}/${id}`;
	} else {
		return `${hostname}/${type_id}/${id}`;
	}
}

export default buildNodeUrl;
