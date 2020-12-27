import TypeNode from 'type/type-node';
import InstanceNode from 'type/instance-node';

interface FieldInput {
	readonly key: string;
	readonly type_node: TypeNode;
	readonly instance_list: InstanceNode[] | undefined;
	readonly draft_value: string;
}

export default FieldInput;
