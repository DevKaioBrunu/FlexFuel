# FlexFuel

FlexFuel é uma aplicação frontend para comparar gasolina e etanol com base na autonomia real de cada veículo cadastrado. O fluxo é simples: cadastrar o veículo, informar os preços do posto e ver qual combustível é mais vantajoso.

## Visão Geral

O projeto foi pensado para ser leve, responsivo e direto ao ponto, com foco em uma interface limpa e uma experiência visual mais sofisticada.

## Link da aplicação: https://flex-fuel-six.vercel.app/

## Funcionalidades

- Cadastro de veículos com tipo, nome, marca, modelo e autonomia.
- Seleção do veículo ativo para os cálculos.
- Comparação automática entre gasolina e etanol.
- Cálculo do custo por quilômetro e da proporção entre os preços.
- Estimativa do custo total para uma quantidade opcional de litros.
- Histórico dos últimos cálculos realizados.
- Alternância entre tema claro e escuro.
- Interface responsiva para desktop e mobile.

## Como Executar

O projeto é estático e não depende de build nem de pacotes adicionais.

1. Abra o arquivo `index.html` no navegador.
2. Se preferir, sirva a pasta com um servidor simples.

Exemplo com Node.js:

```bash
npx serve .
```

## Como Usar

1. Acesse a aba Meus Veículos e cadastre um veículo.
2. Informe se é carro ou moto e preencha as autonomias.
3. Vá para a aba Calcular.
4. Informe os preços por litro e, se quiser, a quantidade de litros.
5. Clique em Calcular para ver o resultado.

## Persistência

Os veículos, o histórico, o veículo selecionado e o tema ficam salvos no navegador.

- A aplicação usa armazenamento local com fallback para a sessão atual.
- Os dados normalmente permanecem entre aberturas no mesmo dispositivo.

## Tecnologias

- HTML
- CSS
- JavaScript

## Estrutura

- `index.html`: layout principal da aplicação.
- `styles.css`: estilos visuais e responsividade.
- `script.js`: lógica de cadastro, cálculo, histórico e persistência.

## Regra de Negócio

A referência geral considera etanol vantajoso quando o preço fica até 70% do valor da gasolina, mas o cálculo final respeita a autonomia cadastrada de cada veículo.
