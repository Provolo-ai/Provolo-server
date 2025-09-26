import "dotenv/config";
import { Polar } from "@polar-sh/sdk";

export type PolarServer = "sandbox" | "production";

export function createPolar(options?: { accessToken?: string; server?: PolarServer }) {
  const accessToken = options?.accessToken ?? process.env.POLAR_ACCESS_TOKEN ?? "";
  const server = (options?.server ?? (process.env.POLAR_SERVER as PolarServer)) || "production";
  return new Polar({ accessToken: accessToken.trim(), server });
}

export async function listCustomers(params: {
  organizationId: string;
  limit?: number;
  page?: number;
  query?: string;
  sorting?: string;
  accessToken?: string;
  server?: PolarServer;
}) {
  const opts: { accessToken?: string; server?: PolarServer } = {};
  if (params.accessToken) opts.accessToken = params.accessToken;
  if (params.server) opts.server = params.server;
  const polar = createPolar(opts);

  return polar.customers.list({
    organizationId: params.organizationId,
    limit: params.limit,
    page: params.page,
    query: params.query,
    sorting: params.sorting as any,
  } as any);
}
