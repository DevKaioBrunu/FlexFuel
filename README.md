# FlexFuel

FlexFuel é um app frontend para comparar gasolina e etanol com base na autonomia real do veículo cadastrado. A aplicação permite salvar veículos, informar preços do posto e descobrir qual combustível está mais vantajoso no momento.

## Link da aplicação: https://flex-fuel-six.vercel.app/

## Funcionalidades

- Cadastro de veículos com nome, marca, modelo e autonomia para gasolina e etanol.
- Seleção de veículo ativo para os cálculos.
- Comparação automática entre gasolina e etanol.
- Cálculo do custo por quilômetro e da proporção entre os preços.
- Estimativa do custo total para uma quantidade opcional de litros.
- Histórico dos últimos cálculos realizados.
- Alternância entre tema claro e escuro.
- Interface responsiva para uso em desktop e mobile.

## Como executar

Este projeto é estático e não depende de build nem de instalação de pacotes.

1. Abra o arquivo `index.html` no navegador.
2. Ou sirva o diretório com um servidor simples, se preferir.

Exemplo com o Node.js instalado:

```bash
npx serve .
```

## Como usar

1. Acesse a aba **Meus Veículos** e cadastre um veículo.
2. Preencha a autonomia para gasolina e etanol.
3. Vá para a aba **Calcular**.
4. Informe os preços por litro e, se quiser, a quantidade de litros.
5. Clique em **Calcular** para ver o resultado.

## Persistência dos dados

Os veículos e o histórico ficam salvos apenas na `sessionStorage` do navegador.

- Os dados permanecem enquanto a aba/janela estiver aberta na mesma sessão.
- Ao fechar a sessão do navegador, os dados podem ser perdidos.

## Tecnologias

- HTML
- CSS
- JavaScript

## Estrutura

- `index.html`: aplicação completa, com layout, estilos e lógica.

## Observação

A regra geral usada pelo app considera etanol vantajoso quando o preço fica até 70% do valor da gasolina, mas o cálculo final respeita a autonomia cadastrada de cada veículo.
