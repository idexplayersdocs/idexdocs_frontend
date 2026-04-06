# Bugfix Requirements Document

## Introduction

O upload de arquivo de contrato (campo `arquivo_url`) está implementado no nível de **Contrato** (`ContractHistory.tsx` / tabela `contrato`), mas deveria estar no nível de **Versão do Contrato** (`ContractHistoryVersion.tsx` / tabela `contratoversao`). Isso significa que hoje um único arquivo é associado ao contrato inteiro, quando na verdade cada versão do contrato deve ter seu próprio documento. A correção envolve mover a lógica de upload/download do frontend e migrar o campo `arquivo_url` da tabela `contrato` para a tabela `contratoversao` no backend.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN o usuário acessa o formulário de criação/edição de um contrato em `ContractHistory.tsx` THEN o sistema exibe o campo de upload de arquivo e armazena `arquivo_url` na tabela `contrato`

1.2 WHEN o usuário visualiza a lista de contratos THEN o sistema exibe o ícone de download associado ao contrato inteiro (via `contract.arquivo_url`), sem distinção por versão

1.3 WHEN o usuário abre as versões de um contrato em `ContractHistoryVersion.tsx` THEN o sistema não exibe campo de upload nem ícone de download, pois a versão não possui `arquivo_url`

1.4 WHEN o backend recebe uma requisição de criação/edição de contrato com arquivo THEN o sistema armazena `arquivo_url` na tabela `contrato`, ignorando a versão específica

### Expected Behavior (Correct)

2.1 WHEN o usuário acessa o formulário de criação/edição de um contrato em `ContractHistory.tsx` THEN o sistema SHALL exibir apenas os campos pertencentes ao contrato (tipo, datas, observação, ativo), sem campo de upload de arquivo

2.2 WHEN o usuário visualiza a lista de contratos THEN o sistema SHALL não exibir ícone de download na linha do contrato, pois o arquivo pertence à versão

2.3 WHEN o usuário abre as versões de um contrato em `ContractHistoryVersion.tsx` THEN o sistema SHALL exibir campo de upload de arquivo no formulário de criação/edição de versão e ícone de download por linha de versão que possua `arquivo_url`

2.4 WHEN o backend recebe uma requisição de criação/edição de versão de contrato com arquivo THEN o sistema SHALL armazenar `arquivo_url` na tabela `contratoversao`, associando o documento à versão correta

### Unchanged Behavior (Regression Prevention)

3.1 WHEN o usuário cria ou edita um contrato sem arquivo THEN o sistema SHALL CONTINUE TO salvar os demais campos (tipo, datas, observação, ativo) normalmente

3.2 WHEN o usuário visualiza a lista de contratos THEN o sistema SHALL CONTINUE TO exibir tipo, nome, versão, observação, datas e status ativo de cada contrato

3.3 WHEN o usuário abre as versões de um contrato THEN o sistema SHALL CONTINUE TO listar todas as versões com versão, observação, data início e data término

3.4 WHEN o usuário navega entre páginas na lista de contratos ou versões THEN o sistema SHALL CONTINUE TO paginar corretamente os resultados

3.5 WHEN o usuário faz upload de um arquivo válido (PDF, JPG, JPEG, PNG, máximo 10MB) em uma versão THEN o sistema SHALL CONTINUE TO validar tipo e tamanho do arquivo antes de enviar
