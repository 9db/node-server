import TypeNode from 'type/type-node';
import SystemId from 'system/enum/id';
import DraftField from 'type/draft-field';
import KeyGenerator from 'utility/key-generator';
import buildNodeUrl from 'utility/build-node-url';
import Operation, { OperationInput } from 'operation';

interface Input extends OperationInput {
	readonly id: string;
	readonly fields: DraftField[];
}

class CreateTypeOperation extends Operation<Input, TypeNode> {
	protected async performInternal(): Promise<TypeNode> {
		const node = await this.buildNode();
		const repository = this.getRepository();
		const persisted_node = await repository.storeNode(node);

		return persisted_node as TypeNode;
	}

	private async buildNode(): Promise<TypeNode> {
		let node = this.getTypeNode();

		const draft_fields = this.getDraftFields();

		draft_fields.forEach((draft_field) => {
			const { key, value } = draft_field;

			node = {
				...node,
				[key]: value
			};
		});

		return node;
	}

	private getTypeNode(): TypeNode {
		const url = this.getUrl();
		const type_url = this.getTypeUrl();
		const creator = this.getAccountUrl();
		const changes = this.getChangesUrl();
		const instances = this.getInstancesUrl();
		const child_types = this.getChildTypesUrl();
		const parent_type = this.getParentTypeUrl();
		const created_at = Date.now();
		const updated_at = created_at;

		return {
			url,
			type: type_url,
			creator,
			created_at,
			updated_at,
			changes,
			instances,
			child_types,
			parent_type
		};
	}

	private getUrl(): string {
		const hostname = this.getHostname();
		const id = this.getId();

		return buildNodeUrl(hostname, {
			type_id: SystemId.GENERIC_TYPE,
			id
		});
	}

	private getTypeUrl(): string {
		const hostname = this.getHostname();

		return buildNodeUrl(hostname, {
			type_id: SystemId.GENERIC_TYPE,
			id: SystemId.GENERIC_TYPE
		});
	}

	private getId(): string {
		const input = this.getInput();

		return input.id;
	}

	private getDraftFields(): DraftField[] {
		const input = this.getInput();

		return input.fields;
	}

	private getAccountUrl(): string {
		const account = this.getAccount();

		return account.url;
	}

	private getChangesUrl(): string {
		const hostname = this.getHostname();

		return buildNodeUrl(hostname, {
			type_id: SystemId.CHANGE_LIST_TYPE,
			id: KeyGenerator.id()
		});
	}

	private getInstancesUrl(): string {
		const hostname = this.getHostname();

		return buildNodeUrl(hostname, {
			type_id: SystemId.INSTANCE_LIST_TYPE,
			id: KeyGenerator.id()
		});
	}

	private getChildTypesUrl(): string {
		const hostname = this.getHostname();

		return buildNodeUrl(hostname, {
			type_id: SystemId.TYPE_LIST_TYPE,
			id: KeyGenerator.id()
		});
	}

	private getParentTypeUrl(): string {
		const hostname = this.getHostname();

		return buildNodeUrl(hostname, {
			type_id: SystemId.GENERIC_TYPE,
			id: SystemId.GENERIC_TYPE
		});
	}
}

export default CreateTypeOperation;
