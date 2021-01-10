import FieldValue from 'type/field-value';
import ChangeStatus from 'enum/change-status';
import InstanceNode from 'type/instance-node';

interface ChangeNode extends InstanceNode {
	readonly status: ChangeStatus;
	readonly field: string;
	readonly old_value: FieldValue;
	readonly new_value: FieldValue;
	readonly approver: string;
}

export default ChangeNode;
