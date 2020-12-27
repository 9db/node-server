import FieldValue from 'type/field-value';

interface Node {
	readonly url: string;
	readonly id: string;
	readonly type_id: string;
	readonly creator: string;
	readonly created_at: number;
	readonly updated_at: number;
	readonly changes: string;
	readonly [key: string]: FieldValue;
}

export default Node;
