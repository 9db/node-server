import TypeNode from 'type/type-node';
import SystemId from 'system/enum/id';
import FieldValue from 'type/field-value';
import InstanceNode from 'type/instance-node';
import getNodeParameters from 'utility/get-node-parameters';
import LoadNodeFromUrlOperation from 'operation/load-node-from-url';
import Operation, { OperationInput } from 'operation';
import FetchListFieldValuesOperation from 'operation/fetch-list-field-values';

interface Input extends OperationInput {
	readonly type_node: TypeNode;
}

class FetchTypeInstancesOperation extends Operation<Input, InstanceNode[]> {
	protected async performInternal(): Promise<InstanceNode[]> {
		const list_values = await this.fetchListValues();
		const instances = await this.fetchInstancesFromListValues(list_values);
		const system_instances = await this.fetchSystemInstances();

		return [...instances, ...system_instances];
	}

	private fetchListValues(): Promise<FieldValue[]> {
		const type_node = this.getTypeNode();
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			node: type_node,
			field_key: 'instances',
			repository,
			account
		};

		const operation = new FetchListFieldValuesOperation(input);

		return operation.perform();
	}

	private fetchInstancesFromListValues(
		list_values: FieldValue[]
	): Promise<InstanceNode[]> {
		const instance_urls = list_values as string[];

		const promises = instance_urls.map((instance_url) => {
			return this.loadInstanceFromUrl(instance_url);
		});

		return Promise.all(promises);
	}

	private async loadInstanceFromUrl(url: string): Promise<InstanceNode> {
		const repository = this.getRepository();
		const account = this.getAccount();

		const input = {
			url,
			repository,
			account
		};

		const operation = new LoadNodeFromUrlOperation(input);
		const node = await operation.perform();

		return node as InstanceNode;
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
