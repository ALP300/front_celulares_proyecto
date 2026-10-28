# Deja el proyecto listo para publicarse como Static Site (carpeta "out").
# Quita el login, las notificaciones por usuario y las rutas que necesitan servidor.
# Uso (dentro de la carpeta del proyecto):
#   powershell -ExecutionPolicy Bypass -File .\convertir-a-static.ps1

$ErrorActionPreference = "Continue"
Set-Location -LiteralPath $PSScriptRoot

$borrar = @(
  # --- Login / sesion / notificaciones ---
  "app\login",
  "app\register",
  "app\api",
  "app\notifications",
  "middleware.ts",
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
  # --- Cosas que requieren servidor (reemplazadas por versiones con ?slug= / ?id=) ---
  "app\actions",
  "app\product\[productSlug]",
  "app\shop\[[...slug]]",
  "app\(dashboard)\admin\categories\[id]",
  "app\(dashboard)\admin\merchant\[id]",
  "app\(dashboard)\admin\orders\[id]",
  "app\(dashboard)\admin\products\[id]",
  "app\(dashboard)\admin\users\[id]",
  # --- Scripts viejos y caches ---
  "quitar-login.ps1",
  ".next",
  "out"
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
Write-Host "Actualizando dependencias..." -ForegroundColor Cyan
npm install
npm prune

Write-Host ""
Write-Host "Generando el sitio estatico..." -ForegroundColor Cyan
npm run build

if (Test-Path -LiteralPath "out\index.html") {
  Write-Host ""
  Write-Host "LISTO: el sitio estatico esta en la carpeta 'out'." -ForegroundColor Green
  Remove-Item -LiteralPath $PSCommandPath -Force
} else {
  Write-Host ""
  Write-Host "El build fallo. Copia el error y envialo." -ForegroundColor Red
}
