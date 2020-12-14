import Manifest from 'type/manifest';
import getRootPath from 'utility/get-root-path';

function loadManifest(): Manifest {
	const root_path = getRootPath();
	const manifest_path = `${root_path}/package.json`;

	return require(manifest_path) as Manifest;
}

const MANIFEST = loadManifest();

function getManifest(): Manifest {
	return MANIFEST;
}

export default getManifest;
