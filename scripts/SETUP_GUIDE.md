# SaveYourself — Unremovable Extension Setup Guide

## How It Works
Windows has a feature called **Group Policy** that lets system administrators control Chrome's behavior. By adding a registry entry, you can tell Chrome to **force-install** your extension — exactly like what schools and companies do. Once applied:
- The **"Remove" button disappears** from `chrome://extensions`
- The extension shows **"Managed by your organization"**
- Even if Chrome is uninstalled and reinstalled, the policy persists
- `chrome://extensions` page is blocked so students can't tamper with it

---

## Step 1: Install the Extension Normally
1. Open Chrome → go to `chrome://extensions/`
2. Enable **Developer Mode** (top-right toggle)
3. Click **"Load unpacked"** → select the `Save_Yourself` folder
4. **Copy the Extension ID** shown below the extension name  
   *(It looks like: `abcdefghijklmnopqrstuvwxyzabcdef` — 32 lowercase letters)*

---

## Step 2: Run the Lock-Down Script
1. Open **PowerShell as Administrator**:
   - Press `Win + S`, type `PowerShell`
   - Right-click → **"Run as Administrator"**
2. Run this command:
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   & ".\scripts\lock_extension.ps1"
   ```
3. Paste your **Extension ID** when prompted
4. **Fully close and reopen Chrome**

---

## Step 3: Verify It Worked
- Open Chrome → go to `chrome://extensions/`
- Find "save_yourself" — the **Remove button should be gone**
- You may see **"Managed by your organization"** label

> ⚠️ If `chrome://extensions` is now blocked (which the script also does), verify it worked BEFORE running step 2 — or temporarily comment out the URLBlocklist section.

---

## To Unlock / Remove the Extension (Admin Only)
Run the unlock script as Administrator:
```powershell
& ".\scripts\unlock_extension.ps1"
```
Then restart Chrome.

---

## Important Limitations
| Scenario | Result |
|---|---|
| Student tries to click "Remove" | ❌ Button doesn't exist |
| Student goes to `chrome://extensions` | ❌ Page is blocked |
| Student uninstalls Chrome and reinstalls | ✅ Policy persists (registry survives) |
| Student uses a different browser (Firefox, Edge) | ⚠️ Not affected — for Edge, a separate policy is needed |
| Student has Admin access on the PC | ⚠️ They could undo it too |

> **Best protection**: Ensure students do **not** have Administrator access on the PC. If they can't open "Run as Administrator", they can't undo this.
