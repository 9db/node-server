import FieldValue from 'type/field-value';

interface Node {
	readonly namespace_key: string;
	readonly type_key: string;
	readonly key: string;
	readonly [key: string]: FieldValue;
}

export default Node;
