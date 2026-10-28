# Quita todo el sistema de login / sesiones / notificaciones por usuario.
# Uso (dentro de la carpeta del proyecto):
#   powershell -ExecutionPolicy Bypass -File .\quitar-login.ps1

$ErrorActionPreference = "Continue"
Set-Location -LiteralPath $PSScriptRoot

$borrar = @(
  "app\login",
  "app\register",
  "app\api",                           # Ruta de NextAuth
  "app\notifications",                 # Notificaciones por usuario (requerian login)
  "middleware.ts",                     # Proteccion de /admin por sesion
  "utils\authOptions.ts",
  "utils\adminAuth.ts",
  "utils\SessionProvider.tsx",
  "lib\authSecret.ts",
  "types\next-auth.d.ts",
  "components\SessionTimeoutTest.tsx",
  "components\SessionTimeoutWrapper.tsx",
  "components\NotificationBell.tsx",
  "components\NotificationCard.tsx",
  "hooks\useSessionTimeout.ts",
  "hooks\useSessionTimeoutTest.ts",
  "hooks\useNotifications.ts",
  "app\_zustand\notificationStore.ts",
  "lib\notification-api.ts",
  "lib\notification-helpers.ts",
  "types\notification.ts",
  ".next"                              # Cache de compilacion
)

foreach ($item in $borrar) {
  if (Test-Path -LiteralPath $item) {
    Remove-Item -LiteralPath $item -Recurse -Force
    Write-Host "Borrado: $item" -ForegroundColor Green
  } else {
    Write-Host "No existe (ok): $item" -ForegroundColor DarkGray
  }
}

Write-Host ""
Write-Host "Quitando next-auth de las dependencias..." -ForegroundColor Cyan
npm install
npm prune

Write-Host ""
Write-Host "Probando el build..." -ForegroundColor Cyan
npm run build

Remove-Item -LiteralPath $PSCommandPath -Force
