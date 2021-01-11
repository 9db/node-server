import Node from 'type/node';
import SystemId from 'system/enum/id';
import NodeParameters from 'type/node-parameters';
import SystemNodeBuilder from 'system/node-builder';

class ListTypeBuilder extends SystemNodeBuilder {
	private inner_type_id: string;

	public constructor(inner_type_id: string) {
		super();

		this.inner_type_id = inner_type_id;
	}

	public build(): Node {
		const node = super.build();
		// TODO: Call this "element type" or something a little more democratic:
		const inner_type = this.getInnerTypeUrl();

		return {
			...node,
			inner_type
		};
	}

	protected getNodeParameters(): NodeParameters {
		const inner_type_id = this.getInnerTypeId();
		const instance_id = `${inner_type_id}-list`;

		return {
			type_id: SystemId.GENERIC_TYPE,
			id: instance_id
		};
	}

	private getInnerTypeUrl(): string {
		const inner_type_id = this.getInnerTypeId();

		return this.buildUrl(SystemId.GENERIC_TYPE, inner_type_id);
	}

	private getInnerTypeId(): string {
		return this.inner_type_id;
	}
}

export default ListTypeBuilder;
