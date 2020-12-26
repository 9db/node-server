import Node from 'type/node';
import isSystemFieldKey from 'system/utility/is-system-field-key';

function getFieldKeys(type_node: Node): string[] {
	const keys = Object.keys(type_node);

	return keys.filter((key) => {
		return isSystemFieldKey(key) === false;
	});
}

export default getFieldKeys;
