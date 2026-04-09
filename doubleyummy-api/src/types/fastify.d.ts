import "@fastify/jwt";
import "fastify";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      sub: string;
      email: string;
      username: string;
    };
    user: {
      sub: string;
      email: string;
      username: string;
    };
  }
}

declare module "fastify" {
  interface FastifyRequest {
    authUser: {
      id: string;
      email: string;
      username: string;
    };
  }
}
