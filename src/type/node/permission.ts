import InstanceNode from 'type/instance-node';
import PermissionType from 'enum/permission-type';

interface PermissionNode extends InstanceNode {
	readonly account: string;
	readonly permission_type: PermissionType;
}

export default PermissionNode;
