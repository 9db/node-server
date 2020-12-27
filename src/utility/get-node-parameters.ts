import SystemId from 'system/enum/id';
import NodeParameters from 'type/node-parameters';

function getNodeParameters(url: string): NodeParameters {
	const parts = url.split('/');
	const id = parts.pop() as string;

	let type_id = parts.pop() as string;

	if (/^[A-Za-z0-9-]+$/.test(type_id) === false || type_id === 'localhost') {
		type_id = SystemId.GENERIC_TYPE;
	}

	return {
		id,
		type_id
	};
}

export default getNodeParameters;
