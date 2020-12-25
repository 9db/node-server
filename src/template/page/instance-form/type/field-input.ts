import Node from 'type/node';

interface FieldInput {
	readonly key: string;
	readonly type_node: Node;
	readonly instance_list: Node[] | undefined;
	readonly draft_value: string;
}

export default FieldInput;
