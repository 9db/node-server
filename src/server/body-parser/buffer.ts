import BodyParser from 'server/body-parser';

class BufferBodyParser extends BodyParser<Buffer> {
	protected transformBuffer(buffer: Buffer): Buffer {
		return buffer;
	}
}

export default BufferBodyParser;
