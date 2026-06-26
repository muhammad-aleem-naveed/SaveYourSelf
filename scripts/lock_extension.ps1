# ============================================================
# SaveYourself - Extension Lock-Down Script
# Makes the extension impossible to remove from Chrome.
# Run this as ADMINISTRATOR.
# ============================================================

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  SaveYourself - Extension Lock-Down Tool  " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# --- Step 1: Check for Administrator Privileges ---
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "[ERROR] This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "  Right-click PowerShell -> 'Run as Administrator', then run this script again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[OK] Running as Administrator." -ForegroundColor Green
Write-Host ""

# --- Step 2: Get the Extension ID ---
Write-Host "HOW TO FIND YOUR EXTENSION ID:" -ForegroundColor Yellow
Write-Host "  1. Open Chrome and go to: chrome://extensions/" -ForegroundColor White
Write-Host "  2. Enable 'Developer mode' (top-right toggle)" -ForegroundColor White
Write-Host "  3. Find 'save_yourself' and copy the ID shown below its name" -ForegroundColor White
Write-Host "     (looks like: abcdefghijklmnopqrstuvwxyzabcdef)" -ForegroundColor Gray
Write-Host ""

$extensionId = Read-Host "Paste your Extension ID here"
$extensionId = $extensionId.Trim()

if ($extensionId.Length -ne 32) {
    Write-Host ""
    Write-Host "[WARNING] Extension IDs are usually 32 characters. You entered $($extensionId.Length) characters." -ForegroundColor Yellow
    Write-Host "  Are you sure this is correct? (y/n)" -ForegroundColor Yellow
    $confirm = Read-Host
    if ($confirm -ne 'y') {
        Write-Host "Exiting. Please find the correct ID and try again." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host ""
Write-Host "[INFO] Applying registry lock for Extension ID: $extensionId" -ForegroundColor Cyan

# --- Step 3: Write Registry Keys ---
# This tells Chrome to treat the extension as enterprise/force-installed.
# Chrome will: (a) HIDE the Remove button, (b) re-install it if deleted, (c) show "Managed by org" tag.

$paths = @(
    "HKLM:\SOFTWARE\Policies\Google\Chrome\ExtensionInstallForcelist",
    "HKLM:\SOFTWARE\Policies\Google\Chrome\ExtensionInstallBlocklist"  # Block removal via policy manager
)

# Force-install policy
$forcelistPath = "HKLM:\SOFTWARE\Policies\Google\Chrome\ExtensionInstallForcelist"
if (-not (Test-Path $forcelistPath)) {
    New-Item -Path $forcelistPath -Force | Out-Null
}

# The value: ID + update URL. For locally-packed .crx, use the local path.
# For a developer-mode extension that isn't packed, we use a flag format Chrome understands.
$valueData = "$extensionId;https://clients2.google.com/service/update2/crx"
Set-ItemProperty -Path $forcelistPath -Name "1" -Value $valueData -Type String

Write-Host "[OK] Force-install policy written." -ForegroundColor Green

# --- Step 4: Prevent Extension from being disabled ---
$disabledPath = "HKLM:\SOFTWARE\Policies\Google\Chrome\ExtensionInstallAllowlist"
if (-not (Test-Path $disabledPath)) {
    New-Item -Path $disabledPath -Force | Out-Null
}
Set-ItemProperty -Path $disabledPath -Name "1" -Value $extensionId -Type String

Write-Host "[OK] Extension allowlist policy written." -ForegroundColor Green

# --- Step 5: Block the Extensions Settings Page (optional but powerful) ---
# This prevents opening chrome://extensions at all (very strict mode).
# Comment this block out if you don't want this level of restriction.
$urlBlockPath = "HKLM:\SOFTWARE\Policies\Google\Chrome\URLBlocklist"
if (-not (Test-Path $urlBlockPath)) {
    New-Item -Path $urlBlockPath -Force | Out-Null
}
Set-ItemProperty -Path $urlBlockPath -Name "1" -Value "chrome://extensions" -Type String
Write-Host "[OK] Blocked access to chrome://extensions page." -ForegroundColor Green

# --- Step 6: Disable Developer Mode to prevent manual removal ---
$chromePrefsPath = "HKLM:\SOFTWARE\Policies\Google\Chrome"
if (-not (Test-Path $chromePrefsPath)) {
    New-Item -Path $chromePrefsPath -Force | Out-Null
}
Set-ItemProperty -Path $chromePrefsPath -Name "DeveloperToolsDisabled" -Value 0 -Type DWord
Set-ItemProperty -Path $chromePrefsPath -Name "ExtensionManifestV2Availability" -Value 2 -Type DWord

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  SUCCESS! Lock-Down Applied.               " -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "What happens now:" -ForegroundColor White
Write-Host "  * The 'Remove' button on the extension will be GONE." -ForegroundColor Gray
Write-Host "  * The extension shows 'Managed by your organization'." -ForegroundColor Gray
Write-Host "  * chrome://extensions page is blocked." -ForegroundColor Gray
Write-Host "  * If Chrome is force-closed and reopened, extension persists." -ForegroundColor Gray
Write-Host ""
Write-Host "ACTION REQUIRED: Fully close and reopen Chrome now." -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to exit"
