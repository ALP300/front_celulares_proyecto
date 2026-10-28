# Limpia todo el backend del proyecto y deja solo el frontend (Next.js).
# Uso: clic derecho > "Ejecutar con PowerShell", o en una terminal dentro de la carpeta:
#   powershell -ExecutionPolicy Bypass -File .\limpiar-backend.ps1

$ErrorActionPreference = "Continue"
Set-Location -LiteralPath $PSScriptRoot

$borrar = @(
  "server",                          # Backend Express completo (rutas, controladores, logs, tests, scripts)
  "prisma",                          # Esquema y migraciones de base de datos
  "app\api\register",                # Ruta API que escribia directo en la base de datos
  "utils\db.ts",                     # Cliente Prisma
  "utils\insertDemoData.js",         # Script de datos demo en la BD
  "utils\errorHandler.ts",           # Manejo de errores Prisma (solo lo usaba /api/register)
  "utils\validation.ts",             # Validaciones del servidor (solo /api/register)
  "utils\schema.ts",                 # Esquemas zod del servidor (solo /api/register)
  "utils\auth.ts",                   # Duplicado sin uso de utils\adminAuth.ts
  "utils\actions.ts",                # Archivo vacio
  "BULK-UPLOAD-EXPLANATION.md",      # Documentacion del backend
  "BULK-UPLOAD-GUIDE.md",
  "BULK-UPLOAD-QUICK-REFERENCE.md",
  "DELETE-BULK-UPLOAD-GUIDE.md",
  "TROUBLESHOOTING-DELETE-BATCH.md",
  "test-bulk-upload.html",           # Pagina de prueba del endpoint del backend
  "components\modules\wishlist",    # Componente sin uso que importaba un archivo inexistente (rompia el build)
  ".next"                            # Cache de compilacion (se regenera sola)
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
Write-Host "Reinstalando dependencias sin Prisma/Express..." -ForegroundColor Cyan
npm install
npm prune

Write-Host ""
Write-Host "Probando el build..." -ForegroundColor Cyan
npm run build

Write-Host ""
Write-Host "Listo. El proyecto ahora es solo frontend." -ForegroundColor Green
Write-Host "Recuerda configurar NEXT_PUBLIC_API_BASE_URL y NEXTAUTH_SECRET en tu archivo .env"

Remove-Item -LiteralPath $PSCommandPath -Force
