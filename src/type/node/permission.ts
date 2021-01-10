import ActionType from 'enum/action-type';
import InstanceNode from 'type/instance-node';

interface PermissionNode extends InstanceNode {
	readonly group: string;
	readonly action_type: ActionType;
}

export default PermissionNode;
