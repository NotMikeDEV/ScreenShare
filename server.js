import {StartServer} from "./src/server.js";
const Server = StartServer();
import {AttachAPI} from "./src/API.js";
AttachAPI(Server);