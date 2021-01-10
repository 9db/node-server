import Node from 'type/node';

interface TypeNode extends Node {
	readonly instances: string[];
	readonly child_types: string[];
	readonly parent_type: string;
}

export default TypeNode;
