# Testes de mutação (mutation testing) no backend InovaTech

Teste de mutação mede a **qualidade** da suíte de testes: a ferramenta injeta pequenas
alterações no bytecode da aplicação (mutantes) — trocar `>` por `>=`, inverter um `if`,
remover uma chamada, devolver `null` — e roda os testes. Se nenhum teste falha, o mutante
"sobreviveu" e existe comportamento não verificado, mesmo com 100% de cobertura de linha.

Ferramenta usada: [PIT / pitest](https://pitest.org) com o plugin JUnit 5, configurada em
`APP/pom.xml`.

## Como executar

```bash
cd APP
./mvnw test-compile org.pitest:pitest-maven:mutationCoverage
```

Relatório: `APP/target/pit-reports/index.html` (HTML navegável, com o código-fonte colorido
por mutante morto/sobrevivente) e `mutations.xml` para integração com ferramentas.

## Configuração

No `pom.xml`:

- `targetClasses`: classes que serão mutadas (hoje `ClienteServiceImpl`).
- `targetTests`: testes usados para matar os mutantes (`...test.unitTest.*`).
- `mutationThreshold` / `coverageThreshold`: o build **falha** se o mutation score ou a
  cobertura de linha das classes mutadas ficar abaixo de 80%.

Para incluir mais classes, adicione outro `<param>` em `targetClasses`, por exemplo:

```xml
<param>br.com.InovaTech.InovaTech.service.impl.*</param>
<param>br.com.InovaTech.InovaTech.controller.*</param>
```

Só inclua uma classe quando já existirem testes unitários para ela — classes sem teste geram
mutantes "NO_COVERAGE" e derrubam o score (e, com threshold ativo, o build).

## Como interpretar o resultado

- **KILLED**: algum teste falhou por causa da mutação — bom.
- **SURVIVED**: nenhum teste percebeu a mudança — falta assertion. Abra o relatório HTML,
  veja a linha e escreva um teste que distinga o comportamento original do mutado.
- **NO_COVERAGE**: a linha nem foi executada pelos testes.
- **TIMED_OUT**: a mutação criou loop infinito; conta como morto.
- **Mutation score** = KILLED / total de mutantes. **Test strength** = KILLED / mutantes cobertos.

Estado atual (`ClienteServiceImpl`): 12 mutantes gerados, 12 mortos — score 100%.

## Uso no CI

Rodar em cada PR, falhando o build abaixo do threshold:

```bash
cd APP && ./mvnw -B test-compile org.pitest:pitest-maven:mutationCoverage
```

Para PRs grandes, dá para analisar só o código alterado usando
`<features><feature>+gitci</feature></features>` (incremental por diff) e publicar
`target/pit-reports` como artefato do job.

## Outras camadas do projeto

- Frontend / testes JS (Cypress, WebdriverIO): a ferramenta equivalente é
  [StrykerJS](https://stryker-mutator.io/docs/stryker-js/introduction/). Vale para código JS
  com testes unitários (Jest/Vitest); não faz sentido para testes E2E, que são lentos demais
  para o loop de mutação.
- Testes de performance (k6) e mobile (Appium) não são alvo de mutation testing.
