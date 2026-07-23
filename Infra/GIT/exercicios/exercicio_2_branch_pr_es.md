# Ejercicio 2: Branch y Pull Request

1. Crea una rama:
   ```powershell
   git checkout -b feature/mi-rama
   ```
2. Modifica un archivo o crea uno nuevo.
3. Agrega, haz commit y sube la rama:
   ```powershell
   git add .
   git commit -m "Mi cambio en la rama"
   git push --set-upstream origin feature/mi-rama
   ```
4. Abre un Pull Request en Bitbucket para revisión.
