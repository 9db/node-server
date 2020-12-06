# node-server

A reference implementation of the 9DB server specification, written in Node.js.

## Installation

```
npm install @9db/server --save
```

```
```

## Usage

```js
import {Server} from '@9db/server';

const server = new Server();

server.start();
```

You should be able to access the server by visiting http://localhost:9999.

```
```

## Options

The following options can be passed to `new Server({ ... })`:

key        | description                                                                                 | default value
---------- | ------------------------------------------------------------------------------------------- | -------------
`port`     | The HTTP port that the 9DB server should bind to.                                           | `9999`
`adapter`  | The database adapter to use for storing nodes. See the [Adapters](#adapters) section below. | `MemoryAdapter`
`hostname` | The [FQDN](https://en.wikipedia.org/wiki/Fully_qualified_domain_name) that this server will be hosted from.                                              | `localhost`

```
```

## Adapters

The server uses adapters in order to store nodes for later use. Pass an explicit
adapter to your server via:

```ts
const adapter = new MemoryAdapter();
const server = new Server({ adapter });
```

There are several different adapters available out of the box:

**`MemoryAdapter`**

This adapter merely retains nodes in local process memory. If the server crashes
or is restarted, all persisted nodes will be lost. Useful for local development
but should be replaced with a different adapter type before you deploy.

If no explicit adapter is specified, this adapter type will be used by default.

```ts
import {MemoryAdapter} from '@9db/server';

const adapter = new MemoryAdapter();
```

**`FilesystemAdapter`**

This adapter persists nodes to the local filesystem. Depending on your needs,
this simple persistence mechanism could be sufficient. However, it is not well
suited to serving high-traffic sites, and cannot function in a load-balanced
cluster.

```ts
import {FilesystemAdapter} from '@9db/server';

const adapter = new FilesystemAdapter({
	path: '/home/pachet/9db/cache'
});
```

**`RedisAdapter`**

This adapter persists nodes to a Redis instance. This is the recommended adapter
to use for high-traffic sites.

```ts
import {RedisAdapter} from '@9db/server';

const adapter = new RedisAdapter({
	hostname: 'localhost',
	port: 6667
});
```

```
```

### Creating your own adapter

You can also specify your own adapter in order to persist your 9DB nodes to
databases that are not supported by the included adapters.

An adapter must implement the following methods:

- `retrieveNode(namespace_key, type_key, node_key)`
- `storeNode(node)`
- `setField(node, field_key, field_value)`
- `addItemToSet(node, set_key, item)`
- `remoteItemFromSet(node, set_key, item)`
- `addItemToList(node, list_key, item, previous_item)`
- `removeItemFromList(node, list_key, item, previous_item)`
