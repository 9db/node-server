import TypeNode from 'type/type-node';
import SystemId from 'system/enum/id';
import InstanceNode from 'type/instance-node';
import getNodeParameters from 'utility/get-node-parameters';
import FetchListFieldNodesOperation from 'operation/fetch-list-field-nodes';
import Operation, { OperationInput } from 'operation';

interface Input extends OperationInput {
	readonly type_node: TypeNode;
}

class FetchTypeInstancesOperation extends Operation<Input, InstanceNode[]> {
	protected async performInternal(): Promise<InstanceNode[]> {
		const instances = await this.fetchInstances();
		const system_instances = await this.fetchSystemInstances();

		return [...instances, ...system_instances];
	}

	private async fetchInstances(): Promise<InstanceNode[]> {
		const type_node = this.getTypeNode();
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			node: type_node,
			field_key: 'instances',
			repository,
			account
		};

		const operation = new FetchListFieldNodesOperation(input);
		const nodes = await operation.perform();

		return nodes as InstanceNode[];
	}

	private fetchSystemInstances(): Promise<InstanceNode[]> {
		if (this.isGenericType()) {
			return this.fetchGenericTypeInstances();
		}

		if (this.isAccountType()) {
			return this.fetchSystemAccountInstances();
		}

		return Promise.resolve([]);
	}

	private async fetchGenericTypeInstances(): Promise<InstanceNode[]> {
		const repository = this.getRepository();

		const string_promise = repository.fetchNode({
			type_id: SystemId.GENERIC_TYPE,
			id: SystemId.STRING_TYPE
		});

		const account_promise = repository.fetchNode({
			type_id: SystemId.GENERIC_TYPE,
			id: SystemId.ACCOUNT_TYPE
		});

		const promises = [string_promise, account_promise];

		const nodes = await Promise.all(promises);

		const instances: InstanceNode[] = [];

		nodes.forEach((node) => {
			if (node !== undefined) {
				instances.push(node);
			}
		});

		return instances;
	}

	private fetchSystemAccountInstances(): Promise<InstanceNode[]> {
		const repository = this.getRepository();

		const promises = [
			repository.fetchSystemAccount(),
			repository.fetchAnonymousAccount()
		];

		return Promise.all(promises);
	}

	private isGenericType(): boolean {
		const node_id = this.getNodeId();

		return node_id === SystemId.GENERIC_TYPE;
	}

	private isAccountType(): boolean {
		const node_id = this.getNodeId();

		return node_id === SystemId.ACCOUNT_TYPE;
	}

	private getNodeId(): string {
		const type_node = this.getTypeNode();
		const parameters = getNodeParameters(type_node.url);

		return parameters.id;
	}

	private getTypeNode(): TypeNode {
		const input = this.getInput();

		return input.type_node;
	}
}

export default FetchTypeInstancesOperation;
