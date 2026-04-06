# Contract Version File Upload Bugfix Design

## Overview

O campo `arquivo_url` e a lógica de upload/download de arquivos estão implementados no nível de **Contrato** (`ContractHistory.tsx` / tabela `contrato`), mas deveriam estar no nível de **Versão do Contrato** (`ContractHistoryVersion.tsx` / tabela `contratoversao`). A correção move toda a lógica de arquivo para o componente de versão, remove os campos de arquivo do componente de contrato, e adiciona as funções HTTP necessárias para criar e editar versões com suporte a upload.

## Glossary

- **Bug_Condition (C)**: A condição que dispara o bug — quando o campo `arquivo` aparece nos formulários de contrato (`ContractHistory.tsx`) e está ausente nos formulários de versão (`ContractHistoryVersion.tsx`)
- **Property (P)**: O comportamento correto esperado — arquivos devem ser associados a versões de contrato, não ao contrato em si
- **Preservation**: Comportamentos existentes que não devem ser alterados pela correção — criação/edição de contratos sem arquivo, listagem de contratos, listagem de versões, paginação
- **ContractHistory**: Componente em `src/components/modal/ContractHistory.tsx` que gerencia a lista de contratos e formulários de criação/edição
- **ContractHistoryVersion**: Componente em `src/components/modal/ContractHistoryVersion.tsx` que gerencia a lista de versões de um contrato (atualmente somente leitura)
- **contract.ts**: Serviço HTTP em `src/lib/http-service/contract.ts` com funções para contratos e versões
- **isBugCondition**: Função pseudocódigo que identifica quando o bug está presente — formulário de contrato contém campo `arquivo` OU formulário de versão não contém campo `arquivo`

## Bug Details

### Bug Condition

O bug se manifesta quando o usuário acessa os formulários de criação ou edição de contrato em `ContractHistory.tsx` e encontra o campo de upload de arquivo, ou quando acessa as versões do contrato em `ContractHistoryVersion.tsx` e não encontra campo de upload nem ícone de download por versão. O campo `arquivo_url` está associado à entidade errada.

**Formal Specification:**
```
FUNCTION isBugCondition(context)
  INPUT: context de tipo { component: string, formType: string }
  OUTPUT: boolean

  IF context.component = 'ContractHistory'
     AND context.formType IN ['register', 'edit']
     AND formContainsField('arquivo')
  THEN RETURN true

  IF context.component = 'ContractHistoryVersion'
     AND NOT formContainsField('arquivo')
     AND NOT rowContainsDownloadIcon()
  THEN RETURN true

  RETURN false
END FUNCTION
```

### Examples

- Usuário abre "Registrar Contrato" → vê campo "Arquivo do Contrato" (incorreto; deveria estar em "Registrar Versão")
- Usuário abre "Editar Contrato" → vê campo "Arquivo do Contrato" com indicador de arquivo atual (incorreto)
- Usuário abre "Versões do Contrato" → não vê botão de adicionar versão, nem campo de arquivo, nem ícone de download por linha (incorreto)
- Usuário faz upload de arquivo ao criar contrato → arquivo fica associado ao contrato inteiro, não à versão específica (incorreto)

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Criação e edição de contratos sem arquivo devem continuar funcionando normalmente (campos tipo, datas, observação, ativo)
- A listagem de contratos deve continuar exibindo tipo, nome, versão, observação, datas e status ativo
- A listagem de versões deve continuar exibindo versão, observação, data início e data término
- A paginação em ambas as listas deve continuar funcionando corretamente
- Os ícones de edição e visualização de versões na tabela de contratos devem continuar funcionando

**Scope:**
Todas as interações que NÃO envolvem o campo `arquivo` nos formulários de contrato devem ser completamente inalteradas por esta correção. Isso inclui:
- Cliques nos botões de salvar contrato sem arquivo
- Navegação entre páginas de contratos e versões
- Abertura e fechamento de modais
- Exibição de dados existentes nas tabelas

## Hypothesized Root Cause

Com base na análise do código, as causas são:

1. **Implementação inicial no nível errado**: O campo `arquivo` foi adicionado ao `formRegisterContractHistory` em `ContractHistory.tsx` e os handlers `handleFileChangeContract` e `handleDownloadContractFile` foram implementados nesse componente, quando deveriam estar em `ContractHistoryVersion.tsx`

2. **Ausência de funções HTTP para versão**: Não existem funções `createContractVersion` e `editContractVersion` em `idexdocs_frontend/src/lib/http-service/contract.ts`, o que impediu a implementação correta no componente de versão

3. **ContractHistoryVersion somente leitura**: O componente `ContractHistoryVersion.tsx` não possui formulários de criação/edição, botão de adicionar, nem lógica de upload — está incompleto para suportar o comportamento correto

4. **Schema de banco de dados incorreto**: O modelo `ContratoVersao` em `idexdocs_api/src/repository/model_objects.py` (linha 278) não possui o campo `arquivo_url`. Esse campo existe apenas em `Contrato` (linha 255). O repositório `ContratoRepo.list_contrato_versao` em `idexdocs_api/src/repository/repo_contrato.py` não seleciona nem retorna `arquivo_url` por versão.

5. **Use cases de contrato processam arquivo no nível errado**: `ContratoCreateUseCase` (`idexdocs_api/src/use_cases/contrato_create.py`) e `ContratoUpdateUseCase` (`idexdocs_api/src/use_cases/contrato_update.py`) fazem upload para Azure Blob Storage e chamam `update_contrato_arquivo_url` que grava em `contrato.arquivo_url`. Não existem use cases equivalentes para `ContratoVersao`.

6. **Ausência de endpoints para criar/editar versão**: Não existem rotas `POST /create/contrato/versao` nem `PUT /update/contrato/versao` registradas em `idexdocs_api/src/main/__init__.py`.

## Correctness Properties

Property 1: Bug Condition - Arquivo Associado à Versão, Não ao Contrato

_For any_ contexto onde o formulário de contrato (registro ou edição) é renderizado, o formulário corrigido SHALL não conter campo de upload de arquivo; e para qualquer versão de contrato com `arquivo_url`, a linha na tabela SHALL exibir ícone de download, e o formulário de versão SHALL conter campo de upload de arquivo.

**Validates: Requirements 2.1, 2.2, 2.3**

Property 2: Preservation - Comportamento de Contrato Sem Arquivo

_For any_ operação de criação ou edição de contrato onde nenhum arquivo é enviado, o código corrigido SHALL produzir o mesmo resultado que o código original, preservando o salvamento correto dos campos tipo, datas, observação e ativo.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

## Fix Implementation

### Changes Required

Assumindo que a análise de causa raiz está correta, as mudanças são organizadas por camada, da base para o topo (backend primeiro, frontend depois).

---

### Backend — `idexdocs_api`

**File**: `idexdocs_api/src/repository/model_objects.py`

**Specific Changes**:
1. **Adicionar `arquivo_url` ao modelo `ContratoVersao`** (linha 278): Adicionar campo `arquivo_url: str | None = None` ao modelo SQLModel `ContratoVersao`, espelhando o campo existente em `Contrato`.

---

**File**: `idexdocs_api/src/repository/repo_contrato.py`

**Specific Changes**:
1. **Atualizar `_create_contrato_versao_objects`**: Incluir `arquivo_url` no dict retornado por cada versão.
2. **Atualizar `list_contrato_versao`**: Adicionar `ContratoVersao.arquivo_url` à query `select(...)`.
3. **Adicionar `update_contrato_versao_arquivo_url`**: Novo método que executa `UPDATE contratoversao SET arquivo_url = :url WHERE id = :id`, espelhando o método `update_contrato_arquivo_url` existente.
4. **Adicionar `create_contrato_versao`**: Novo método que insere uma nova linha em `ContratoVersao` com os campos `contrato_id`, `data_inicio`, `data_termino`, `observacao`, incrementando `versao` automaticamente (buscar `MAX(versao)` para o `contrato_id` e somar 1). Também deve atualizar `Contrato.versao` para refletir a versão mais recente.
5. **Adicionar `update_contrato_versao`**: Novo método que atualiza `data_inicio`, `data_termino`, `observacao` de uma `ContratoVersao` pelo seu `id`.

---

**File**: `idexdocs_api/src/use_cases/contrato_create.py`

**Specific Changes**:
1. **Remover lógica de upload de arquivo**: Remover o bloco `if file and self.storage_service` e a chamada a `update_contrato_arquivo_url`. O `ContratoCreateUseCase` não deve mais processar arquivos — isso passa a ser responsabilidade do novo use case de versão.
2. **Remover `MIME_TYPE_EXT_MAP` e `_upload_file`**: Esses métodos deixam de ser necessários neste use case.

---

**File**: `idexdocs_api/src/use_cases/contrato_update.py`

**Specific Changes**:
1. **Remover lógica de upload de arquivo**: Remover o bloco `if file and self.storage_service` e a chamada a `update_contrato_arquivo_url`. O `ContratoUpdateUseCase` não deve mais processar arquivos.
2. **Remover `MIME_TYPE_EXT_MAP` e `_upload_file`**: Esses métodos deixam de ser necessários neste use case.

---

**File**: `idexdocs_api/src/use_cases/contrato_versao_create.py` *(novo arquivo)*

**Specific Changes**:
1. **Criar `ContratoVersaoCreateUseCase`**: Seguindo o padrão de `ContratoCreateUseCase`. Aceita `http_request` com `json` ou `files` (FormData). Campos: `contrato_id`, `data_inicio`, `data_termino`, `observacao`, `arquivo` (opcional). Chama `contrato_repository.create_contrato_versao(...)`. Se `arquivo` presente, faz upload para Azure Blob Storage no container `atleta-contratos` com filename `contrato_versao_{versao_id}{ext}` e chama `contrato_repository.update_contrato_versao_arquivo_url(versao_id, url)`. Reutilizar o padrão `MIME_TYPE_EXT_MAP` / `_upload_file` já existente nos use cases de contrato.

---

**File**: `idexdocs_api/src/use_cases/contrato_versao_update.py` *(novo arquivo)*

**Specific Changes**:
1. **Criar `ContratoVersaoUpdateUseCase`**: Seguindo o padrão de `ContratoUpdateUseCase`. Campos: `versao_id`, `data_inicio`, `data_termino`, `observacao`, `arquivo` (opcional). Chama `contrato_repository.update_contrato_versao(...)`. Se `arquivo` presente, faz upload e chama `update_contrato_versao_arquivo_url`.

---

**File**: `idexdocs_api/src/schemas/contrato.py`

**Specific Changes**:
1. **Adicionar `ContratoVersaoCreateSchema`**: Pydantic model com `contrato_id: int`, `data_inicio: str`, `data_termino: str`, `observacao: str | None`, com validador de data igual ao existente.
2. **Adicionar `ContratoVersaoUpdateSchema`**: Pydantic model com `versao_id: int`, `data_inicio: str`, `data_termino: str`, `observacao: str | None`.

---

**File**: `idexdocs_api/src/presentation/controllers/contrato_versao_create_controler.py` *(novo arquivo)*

**Specific Changes**:
1. **Criar `ContratoVersaoCreateController`**: Seguindo o padrão de `ContratoCreateController`. Retorna `HttpStatusCode.CREATED`.

---

**File**: `idexdocs_api/src/presentation/controllers/contrato_versao_update_controler.py` *(novo arquivo)*

**Specific Changes**:
1. **Criar `ContratoVersaoUpdateController`**: Seguindo o padrão de `ContratoUpdateController`. Retorna `HttpStatusCode.OK`.

---

**File**: `idexdocs_api/src/main/composers/contrato_versao_create_composer.py` *(novo arquivo)*

**Specific Changes**:
1. **Criar `contrato_versao_create_composer`**: Instancia `ContratoRepo`, `AzureBlobStorage`, `ContratoVersaoCreateUseCase` e `ContratoVersaoCreateController`. Seguindo o padrão de `contrato_create_composer.py`.

---

**File**: `idexdocs_api/src/main/composers/contrato_versao_update_composer.py` *(novo arquivo)*

**Specific Changes**:
1. **Criar `contrato_versao_update_composer`**: Seguindo o padrão de `contrato_update_composer.py`.

---

**File**: `idexdocs_api/src/main/rest/contrato_versao_create.py` *(novo arquivo)*

**Specific Changes**:
1. **Criar função `contrato_versao_create`**: Seguindo o padrão de `contrato_create.py`. Chama `validate_schema` com `ContratoVersaoCreateSchema` e `request_adapter` com `contrato_versao_create_composer()`.

---

**File**: `idexdocs_api/src/main/rest/contrato_versao_update.py` *(novo arquivo)*

**Specific Changes**:
1. **Criar função `contrato_versao_update`**: Seguindo o padrão de `contrato_update.py`.

---

**File**: `idexdocs_api/src/main/__init__.py`

**Specific Changes**:
1. **Importar** `contrato_versao_create` e `contrato_versao_update` dos novos módulos rest.
2. **Registrar rotas**:
   - `router.add_api_route('/create/contrato/versao', endpoint=contrato_versao_create, methods=['POST'], tags=['Contrato'])`
   - `router.add_api_route('/update/contrato/versao', endpoint=contrato_versao_update, methods=['PUT'], tags=['Contrato'])`

---

### Frontend — `idexdocs_frontend`

**File**: `idexdocs_frontend/src/lib/http-service/contract.ts`

**Specific Changes**:
1. **Adicionar `createContractVersion`**: `POST /create/contrato/versao` aceitando `FormData | Partial<ContractVersion>`.
2. **Adicionar `editContractVersion`**: `PUT /update/contrato/versao` aceitando `FormData | Partial<ContractVersion>`.

---

**File**: `idexdocs_frontend/src/components/modal/ContractHistory.tsx`

**Specific Changes**:
1. **Remover `arquivo` e `arquivo_url` do estado** `formRegisterContractHistory`.
2. **Remover handlers**: `handleFileChangeContract`, `handleDownloadContractFile`.
3. **Remover `formData.append('arquivo', ...)`** de `handleSaveRegisterContractHistory` e `handleSaveEditContract`.
4. **Remover `<input type="file">`** e labels associados dos modais "Registrar Contrato" e "Editar Contrato".
5. **Remover ícone de download** (`faDownload`) da linha da tabela de contratos.
6. **Remover import `faDownload`** do FontAwesome.

---

**File**: `idexdocs_frontend/src/components/modal/ContractHistoryVersion.tsx`

**Specific Changes**:
1. **Adicionar imports**: `faDownload`, `faPenSquare`, `faX` do FontAwesome; `AddButton`; `createContractVersion`, `editContractVersion` de `contract.ts`; `Bounce`, `toast`, `ToastContainer` do react-toastify; `Box`, `Modal` do MUI; `Checkbox`.
2. **Adicionar estado do formulário**: `formVersion` com campos `contrato_id` (inicializado com `contractId`), `data_inicio`, `data_termino`, `observacao`, `arquivo: null`, `versao_id` (para edição), `arquivo_url` (para edição).
3. **Adicionar estados de modal**: `openRegisterVersion`, `openEditVersion`.
4. **Adicionar `AddButton`** acima da tabela para abrir o modal de registro.
5. **Adicionar coluna "Arquivo"** na tabela: ícone `faDownload` condicional quando `version.arquivo_url` existe; ícone `faPenSquare` para abrir edição.
6. **Adicionar validação de arquivo**: `handleFileChangeVersion` com validação de tamanho (máx 10MB) e tipo (PDF/JPG/JPEG/PNG), espelhando a lógica existente em `ContractHistory.tsx`.
7. **Adicionar handlers**: `handleSaveRegisterVersion` (chama `createContractVersion`), `handleSaveEditVersion` (chama `editContractVersion`), `handleDownloadVersionFile`.
8. **Adicionar modais**: "Registrar Versão" e "Editar Versão" com campos `data_inicio`, `data_termino`, `observacao`, `arquivo`. Usar `styleForm` equivalente ao de `ContractHistory.tsx`.
9. **Atualizar `_create_contrato_versao_objects`** no backend garante que `arquivo_url` chegue por versão; o componente deve ler `version.arquivo_url` para exibir o ícone de download.

## Testing Strategy

### Validation Approach

A estratégia de testes segue duas fases: primeiro, evidenciar contraexemplos que demonstram o bug no código não corrigido; depois, verificar que a correção funciona e preserva o comportamento existente.

### Exploratory Bug Condition Checking

**Goal**: Evidenciar contraexemplos que demonstram o bug ANTES de implementar a correção. Confirmar ou refutar a análise de causa raiz.

**Test Plan**: Renderizar `ContractHistory` e verificar que o formulário de registro contém campo de arquivo. Renderizar `ContractHistoryVersion` e verificar que não há botão de adicionar nem campo de arquivo. Executar esses testes no código NÃO CORRIGIDO para observar as falhas.

**Test Cases**:
1. **Formulário de Registro de Contrato contém arquivo**: Renderizar modal de registro e verificar presença de `input[type="file"]` (vai passar no código não corrigido, deve falhar após a correção)
2. **Formulário de Edição de Contrato contém arquivo**: Renderizar modal de edição e verificar presença de `input[type="file"]` (vai passar no código não corrigido, deve falhar após a correção)
3. **ContractHistoryVersion não tem campo de arquivo**: Renderizar versões e verificar ausência de `input[type="file"]` (vai passar no código não corrigido, deve falhar após a correção)
4. **Linha de contrato exibe ícone de download**: Renderizar tabela com contrato que tem `arquivo_url` e verificar presença de ícone de download (vai passar no código não corrigido, deve falhar após a correção)

**Expected Counterexamples**:
- Formulários de contrato contêm campo de arquivo quando não deveriam
- Versões de contrato não possuem campo de arquivo quando deveriam

### Fix Checking

**Goal**: Verificar que para todos os inputs onde a condição de bug se aplica, a função corrigida produz o comportamento esperado.

**Pseudocode:**
```
FOR ALL context WHERE isBugCondition(context) DO
  result := renderComponent_fixed(context)
  ASSERT expectedBehavior(result)
END FOR
```

### Preservation Checking

**Goal**: Verificar que para todos os inputs onde a condição de bug NÃO se aplica, o código corrigido produz o mesmo resultado que o código original.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT originalBehavior(input) = fixedBehavior(input)
END FOR
```

**Testing Approach**: Testes baseados em propriedades são recomendados para preservation checking porque:
- Geram muitos casos de teste automaticamente no domínio de entrada
- Capturam edge cases que testes unitários manuais podem perder
- Fornecem garantias fortes de que o comportamento é preservado para todos os inputs não-bugados

**Test Plan**: Observar comportamento no código NÃO CORRIGIDO para operações de contrato sem arquivo, depois escrever testes de propriedade capturando esse comportamento.

**Test Cases**:
1. **Preservação de campos do contrato**: Verificar que criar/editar contrato sem arquivo ainda salva tipo, datas, observação e ativo corretamente
2. **Preservação da listagem de contratos**: Verificar que a tabela de contratos ainda exibe todas as colunas esperadas (tipo, nome, versão, observação, datas, ativo)
3. **Preservação da listagem de versões**: Verificar que a tabela de versões ainda exibe versão, observação, data início e data término
4. **Preservação da paginação**: Verificar que a paginação continua funcionando em ambas as listas

### Unit Tests

- Testar que `ContractHistory` não renderiza `input[type="file"]` nos formulários após a correção
- Testar que `ContractHistoryVersion` renderiza `input[type="file"]` nos formulários após a correção
- Testar validação de arquivo na versão (rejeitar > 10MB, rejeitar tipos inválidos)
- Testar que linhas de versão com `arquivo_url` exibem ícone de download
- Testar que linhas de contrato não exibem ícone de download após a correção

### Property-Based Tests

- Gerar estados de contrato aleatórios e verificar que o formulário de contrato nunca contém campo de arquivo
- Gerar versões aleatórias com e sem `arquivo_url` e verificar que o ícone de download aparece apenas quando `arquivo_url` existe
- Gerar arquivos com tamanhos e tipos variados e verificar que a validação aceita apenas os permitidos

### Integration Tests

- Testar fluxo completo: criar contrato → abrir versões → registrar versão com arquivo → verificar download disponível
- Testar que editar contrato existente não perde dados ao remover campo de arquivo do formulário
- Testar que a navegação entre modais (contrato → versões → registrar versão) funciona corretamente
