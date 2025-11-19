# Exercício 3: Simulando Conflito

1. Em dois clones diferentes do mesmo repositório, edite a mesma linha de um arquivo (ex: `README.md`).
2. Cada pessoa faz commit e push.
3. O segundo push irá falhar. Faça:
   ```powershell
   git pull origin main
   # Resolva o conflito manualmente
   git add README.md
   git commit -m "Resolve conflito de merge"
   git push
   ```
