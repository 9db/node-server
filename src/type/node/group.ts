import InstanceNode from 'type/instance-node';

interface GroupNode extends InstanceNode {
	readonly accounts: string;
}

export default GroupNode;
