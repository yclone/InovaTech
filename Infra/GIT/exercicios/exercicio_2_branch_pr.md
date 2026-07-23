# Exercício 2: Branch e Pull Request

1. Crie uma branch:
   ```powershell
   git checkout -b feature/minha-branch
   ```
2. Modifique um arquivo ou crie um novo.
3. Adicione, faça commit e suba a branch:
   ```powershell
   git add .
   git commit -m "Minha alteração na branch"
   git push --set-upstream origin feature/minha-branch
   ```
4. Abra um Pull Request no Bitbucket para revisão.