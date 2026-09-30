# GitHub Publishing Checklist

Before the first commit:

```powershell
git init
git branch -M main
git add .
git status
```

Confirm that `node_modules`, `dist`, `server/.env`, runtime uploads, backups, and logs are not staged.

Run a secret scan:

```powershell
git grep --cached -n -I -E "password|secret|token|credential|api[_-]?key|private[_-]?key"
```

Run a personal-data scan:

```powershell
git grep --cached -n -I -E "@gmail\.com|@yahoo\.com|@outlook\.com|wa\.me|BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY"
```

Review matches manually. Environment-variable names, source-code field names, and synthetic demo placeholders are expected.

Then commit:

```powershell
git commit -m "Initial release: Iinvitation"
```

Suggested repository:

```text
https://github.com/Febriantrip/iinvitation.git
```
