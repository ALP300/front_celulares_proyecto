import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import config from "@/lib/config";

// Frontend puro: la validación de credenciales la hace el backend externo.
// El backend debe exponer POST {NEXT_PUBLIC_API_BASE_URL}/api/auth/login
// que reciba { email, password } y devuelva { id, email, role } si son correctos.
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        try {
          const res = await fetch(`${config.apiBaseUrl}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          if (!res.ok) return null;

          const user = await res.json();
          if (!user?.id) return null;

          return {
            id: user.id,
            email: user.email,
            role: user.role,
          };
        } catch (err: any) {
          console.error("Error al iniciar sesión:", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.iat = Math.floor(Date.now() / 1000);
      }

      // Token expira a los 15 minutos
      const now = Math.floor(Date.now() / 1000);
      const tokenAge = now - (token.iat as number);
      if (tokenAge > 15 * 60) {
        return {};
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 15 * 60,
    updateAge: 5 * 60,
  },
  jwt: {
    maxAge: 15 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
