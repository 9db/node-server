import ChangeType from 'enum/change-type';
import FieldValue from 'type/field-value';
import ChangeStatus from 'enum/change-status';
import InstanceNode from 'type/instance-node';

interface ChangeNode extends InstanceNode {
	readonly status: ChangeStatus;
	readonly change_type: ChangeType;
	readonly field: string;
	readonly value: FieldValue;
	readonly previous_value: FieldValue;
	readonly approver: string;
}

export default ChangeNode;
