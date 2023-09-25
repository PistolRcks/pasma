// This file handles session token handling caused by logins. Also handles logins.

import { BunRequest } from "bunrest/src/server/request";
import { BunResponse } from "bunrest/src/server/response";

/**
 * Given a JSON input (via request),
 * Returns token and stores token
 */
export async function login(req: BunRequest, res: BunResponse) {
}