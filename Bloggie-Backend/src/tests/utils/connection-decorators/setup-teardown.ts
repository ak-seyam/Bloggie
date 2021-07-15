import { AsyncFunction } from "@services/utils/errors-wrapper";
import { startingServer } from "@utils/api/server-connection";

export default async function Setup(port: number, next: AsyncFunction) {
  await startingServer(port);
  await next();
}
