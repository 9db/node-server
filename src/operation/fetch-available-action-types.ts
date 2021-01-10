import Node from 'type/node';
import ActionType from 'enum/action-type';
import Operation, { OperationInput } from 'operation';

interface Input extends OperationInput {
	readonly node: Node;
}

class FetchAvailableActionTypesOperation extends Operation<
	Input,
	ActionType[]
> {
	protected performInternal(): Promise<ActionType[]> {
		return Promise.resolve([]);
	}
}

export default FetchAvailableActionTypesOperation;
