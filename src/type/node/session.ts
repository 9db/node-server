import InstanceNode from 'type/instance-node';

interface SessionNode extends InstanceNode {
	readonly account: string;
}

export default SessionNode;
