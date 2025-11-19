# Exemplo de Conflito em Código

Suponha que dois desenvolvedores editam a mesma linha de um arquivo `app.js`:

```js
// Versão do Dev A
console.log('Olá do Dev A');

// Versão do Dev B
console.log('Olá do Dev B');
```

Ao tentar fazer merge, o Git irá mostrar:

```diff
<<<<<<< HEAD
console.log('Olá do Dev A');
=======
console.log('Olá do Dev B');
>>>>>>> feature/dev-b
```

Resolva escolhendo ou combinando as linhas.