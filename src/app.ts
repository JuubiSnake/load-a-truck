import { Server } from "./rest/v1/server/server";
import { MemoryStorageClient } from "./storage/memory";

const routeHandler = new Server(new MemoryStorageClient());

routeHandler.listen();