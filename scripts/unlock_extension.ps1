# ============================================================
# SaveYourself - UNLOCK Script (Admin use only)
# Removes the lock-down policies so Chrome behaves normally.
# Run this as ADMINISTRATOR.
# ============================================================

Write-Host ""
Write-Host "============================================" -ForegroundColor Yellow
Write-Host "  SaveYourself - UNLOCK Tool (Admin Only)  " -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Yellow
Write-Host ""

if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "[ERROR] Must be run as Administrator!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "This will REMOVE all lock-down policies and restore Chrome to normal." -ForegroundColor White
Write-Host "Type 'CONFIRM' to proceed: " -ForegroundColor Red -NoNewline
$input = Read-Host
if ($input -ne 'CONFIRM') {
    Write-Host "Cancelled." -ForegroundColor Gray
    Read-Host "Press Enter to exit"
    exit 0
}

# Remove all Chrome policy keys
$keysToRemove = @(
    "HKLM:\SOFTWARE\Policies\Google\Chrome\ExtensionInstallForcelist",
    "HKLM:\SOFTWARE\Policies\Google\Chrome\ExtensionInstallAllowlist",
    "HKLM:\SOFTWARE\Policies\Google\Chrome\URLBlocklist"
)

foreach ($key in $keysToRemove) {
    if (Test-Path $key) {
        Remove-Item -Path $key -Recurse -Force
        Write-Host "[OK] Removed: $key" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "[DONE] All policies removed. Restart Chrome to apply." -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to exit"
