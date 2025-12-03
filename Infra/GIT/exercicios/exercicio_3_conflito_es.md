# Ejercicio 3: Simulando Conflicto

1. En dos clones diferentes del mismo repositorio, edita la misma línea de un archivo (ej: `README.md`).
2. Cada persona hace commit y push.
3. El segundo push fallará. Haz lo siguiente:
   ```powershell
   git pull origin main
   # Resuelve el conflicto manualmente
   git add README.md
   git commit -m "Resuelve conflicto de merge"
   git push
   ```
