// Clave para firmar las sesiones de NextAuth.
// Usa NEXTAUTH_SECRET del .env si existe; si no, esta clave de respaldo.
// En producción real, define NEXTAUTH_SECRET en el servidor y no uses el respaldo.
export const authSecret =
  process.env.NEXTAUTH_SECRET || "99541209785bf84c2da9ba89c475a01a8884d10281d2cd910ea89d4f54ba20dc";
