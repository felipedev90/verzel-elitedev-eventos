# Uso de IA neste projeto

## Ferramentas

Claude (Anthropic), via chat, para pair programming em todo o projeto: back-end, front-end, decisões de arquitetura, revisão de código e debugging.

## Como o processo funcionou

Diferente do uso comum de IA para gerar código pronto, conduzi o projeto no papel de orquestrador: pedia explicação da abordagem antes do código, questionava decisões que não entendia ou não fazia sentido para mim, e corrigia o rumo quando o resultado não estava no nível que eu queria. O Claude escrevia o código e explicava o raciocínio; eu validava, testava manualmente via `curl` e no navegador, e só seguia adiante quando o resultado estava correto.

Isso significa que boa parte deste README e do código carrega decisões que vieram de mim questionando o Claude, não de aceitar a primeira sugestão. Alguns exemplos concretos:

- Quando o código do checkout veio sem tratamento de erro robusto na primeira versão, cobrei explicitamente e pedi timeout, tipo de erro customizado e tratamento de falha de rede antes de seguir.
- Recusei a primeira versão da tela de login por parecer genérica demais, e pedi uma identidade visual real (paleta, fontes, composição), com justificativa técnica para cada escolha.
- Quando o organizador de eventos ficou vulnerável a um bypass de autenticação (dava para acessar o checkout inteiro sem estar logado), fui eu que percebi e pedi correção, não o Claude que identificou sozinho.
- Pedi divisão de componentes grandes em pedaços menores repetidamente ao longo do projeto, mantendo o padrão de composição Server/Client Component que o próprio Next recomenda.

## Decisões técnicas que exigi entender antes de aceitar

- Por que Route Handlers do Next em vez de um back-end separado (documentado no README)
- Por que a proteção contra venda duplicada de assento depende de constraint de banco, não só checagem em código
- Por que o QR code usa HMAC com `timingSafeEqual` em vez de comparação simples de string

## O que fiz sem IA

- Todas as decisões de produto e escopo (o que entra, o que fica de fora, prioridade entre features)
- Identidade visual do produto: nome (KinoGarten), paleta, referências visuais trazidas de outros produtos (Royal Opera, Showcase Cinemas, MoviePass)
- Testes manuais de cada funcionalidade antes de aceitar como pronta
- Revisão crítica de cada decisão técnica proposta, questionando o que não fazia sentido

## Artefatos versionados

O histórico completo de commits no GitHub reflete o processo real de construção, incremental, branch por feature, com mensagens descritivas.
