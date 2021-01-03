import NodeParameters from 'type/node-parameters';
import SystemNodeGenerator from 'system/node-generator';

class ListTypeGenerator extends SystemNodeGenerator {
	private parameters: NodeParameters;

	public constructor(hostname: string, parameters: NodeParameters) {
		super(hostname);

		this.parameters = parameters;
	}

	protected getNodeParameters(): NodeParameters {
		return this.parameters;
	}
}

export default ListTypeGenerator;
