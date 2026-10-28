// Extiende (no reemplaza) los tipos de next-auth.
// Los imports convierten este archivo en módulo, requisito para que
// "declare module" funcione como ampliación de tipos.
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      role: string;
    };
  }

  interface User {
    id: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}
