# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Arquivo Associado ao Contrato em vez da Versão
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to the concrete failing cases for reproducibility
  - Test 1: Render `ContractHistory` register modal and assert `input[type="file"]` is NOT present (will FAIL on unfixed code — field exists when it shouldn't)
  - Test 2: Render `ContractHistory` edit modal and assert `input[type="file"]` is NOT present (will FAIL on unfixed code)
  - Test 3: Render `ContractHistoryVersion` and assert `input[type="file"]` IS present in the version form (will FAIL on unfixed code — field is missing when it should exist)
  - Test 4: Render `ContractHistoryVersion` with a version that has `arquivo_url` and assert a download icon IS present per row (will FAIL on unfixed code)
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests FAIL (this is correct - it proves the bug exists)
  - Document counterexamples found (e.g., "ContractHistory register form contains `input[type=file]`; ContractHistoryVersion has no download icon per version row")
  - Mark task complete when tests are written, run, and failures are documented
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Comportamento de Contrato Sem Arquivo
  - **IMPORTANT**: Follow observation-first methodology
  - Observe: creating/editing a contract without a file still saves tipo, datas, observação, ativo on unfixed code
  - Observe: contract list table still renders tipo, nome, versão, observação, datas, ativo columns on unfixed code
  - Observe: version list table still renders versão, observação, data_inicio, data_termino columns on unfixed code
  - Observe: pagination controls still work on both lists on unfixed code
  - Write property-based tests: for any contract form submission without a file, the saved fields (tipo, datas, observação, ativo) are unchanged
  - Write property-based tests: for any contract list render, all expected columns are present regardless of arquivo_url value
  - Write property-based tests: for any version list render, all expected columns are present
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 3. Fix — mover lógica de arquivo do Contrato para a Versão do Contrato

  - [x] 3.1 Adicionar `arquivo_url` ao modelo `ContratoVersao` no backend
    - Em `idexdocs_api/src/repository/model_objects.py`, adicionar campo `arquivo_url: str | None = None` ao modelo `ContratoVersao` (linha ~278), espelhando o campo existente em `Contrato`
    - _Bug_Condition: isBugCondition(context) where context.component = 'ContractHistoryVersion' AND NOT formContainsField('arquivo')_
    - _Expected_Behavior: arquivo_url associado à tabela contratoversao, não à tabela contrato_
    - _Preservation: campos existentes de ContratoVersao (versao, data_inicio, data_termino, observacao) não devem ser alterados_
    - _Requirements: 2.4_

  - [x] 3.2 Atualizar `repo_contrato.py` com métodos de versão
    - Atualizar `_create_contrato_versao_objects`: incluir `arquivo_url` no dict retornado por cada versão
    - Atualizar `list_contrato_versao`: adicionar `ContratoVersao.arquivo_url` ao `select(...)`
    - Adicionar `update_contrato_versao_arquivo_url(versao_id, url)`: UPDATE contratoversao SET arquivo_url = :url WHERE id = :id
    - Adicionar `create_contrato_versao(contrato_id, data_inicio, data_termino, observacao)`: inserir nova linha em ContratoVersao com versao = MAX(versao)+1 para o contrato_id; atualizar Contrato.versao para refletir a versão mais recente
    - Adicionar `update_contrato_versao(versao_id, data_inicio, data_termino, observacao)`: atualizar campos da versão pelo id
    - _Requirements: 2.3, 2.4_

  - [x] 3.3 Remover lógica de arquivo dos use cases de contrato
    - Em `idexdocs_api/src/use_cases/contrato_create.py`: remover bloco `if file and self.storage_service`, chamada a `update_contrato_arquivo_url`, `MIME_TYPE_EXT_MAP` e `_upload_file`
    - Em `idexdocs_api/src/use_cases/contrato_update.py`: mesmas remoções
    - _Bug_Condition: isBugCondition(context) where context.component = 'ContractHistory' AND formContainsField('arquivo')_
    - _Preservation: demais campos do contrato (tipo, datas, observacao, ativo) devem continuar sendo salvos normalmente_
    - _Requirements: 2.1, 3.1_

  - [x] 3.4 Criar use case `ContratoVersaoCreateUseCase`
    - Criar `idexdocs_api/src/use_cases/contrato_versao_create.py`
    - Aceitar `http_request` com `json` ou `files` (FormData); campos: `contrato_id`, `data_inicio`, `data_termino`, `observacao`, `arquivo` (opcional)
    - Chamar `contrato_repository.create_contrato_versao(...)`
    - Se `arquivo` presente: fazer upload para Azure Blob Storage no container `atleta-contratos` com filename `contrato_versao_{versao_id}{ext}`; chamar `update_contrato_versao_arquivo_url(versao_id, url)`
    - Reutilizar padrão `MIME_TYPE_EXT_MAP` / `_upload_file` dos use cases de contrato existentes
    - _Expected_Behavior: arquivo_url gravado em contratoversao.arquivo_url_
    - _Requirements: 2.3, 2.4_

  - [x] 3.5 Criar use case `ContratoVersaoUpdateUseCase`
    - Criar `idexdocs_api/src/use_cases/contrato_versao_update.py`
    - Campos: `versao_id`, `data_inicio`, `data_termino`, `observacao`, `arquivo` (opcional)
    - Chamar `contrato_repository.update_contrato_versao(...)`; se `arquivo` presente, fazer upload e chamar `update_contrato_versao_arquivo_url`
    - _Requirements: 2.3, 2.4_

  - [x] 3.6 Adicionar schemas `ContratoVersaoCreateSchema` e `ContratoVersaoUpdateSchema`
    - Em `idexdocs_api/src/schemas/contrato.py`:
      - `ContratoVersaoCreateSchema`: `contrato_id: int`, `data_inicio: str`, `data_termino: str`, `observacao: str | None`, com validador de data igual ao existente
      - `ContratoVersaoUpdateSchema`: `versao_id: int`, `data_inicio: str`, `data_termino: str`, `observacao: str | None`
    - _Requirements: 2.4_

  - [x] 3.7 Criar controllers para versão de contrato
    - Criar `idexdocs_api/src/presentation/controllers/contrato_versao_create_controler.py` com `ContratoVersaoCreateController` retornando `HttpStatusCode.CREATED`
    - Criar `idexdocs_api/src/presentation/controllers/contrato_versao_update_controler.py` com `ContratoVersaoUpdateController` retornando `HttpStatusCode.OK`
    - Seguir padrão de `ContratoCreateController` / `ContratoUpdateController`
    - _Requirements: 2.4_

  - [x] 3.8 Criar composers para versão de contrato
    - Criar `idexdocs_api/src/main/composers/contrato_versao_create_composer.py`: instanciar `ContratoRepo`, `AzureBlobStorage`, `ContratoVersaoCreateUseCase`, `ContratoVersaoCreateController`
    - Criar `idexdocs_api/src/main/composers/contrato_versao_update_composer.py`: seguir padrão de `contrato_update_composer.py`
    - _Requirements: 2.4_

  - [x] 3.9 Criar REST handlers e registrar rotas
    - Criar `idexdocs_api/src/main/rest/contrato_versao_create.py`: chamar `validate_schema` com `ContratoVersaoCreateSchema` e `request_adapter` com `contrato_versao_create_composer()`
    - Criar `idexdocs_api/src/main/rest/contrato_versao_update.py`: seguir padrão de `contrato_update.py`
    - Em `idexdocs_api/src/main/__init__.py`: importar os novos handlers e registrar rotas:
      - `POST /create/contrato/versao`
      - `PUT /update/contrato/versao`
    - _Requirements: 2.4_

  - [x] 3.10 Adicionar `createContractVersion` e `editContractVersion` ao serviço HTTP frontend
    - Em `idexdocs_frontend/src/lib/http-service/contract.ts`:
      - `createContractVersion`: `POST /create/contrato/versao` aceitando `FormData | Partial<ContractVersion>`
      - `editContractVersion`: `PUT /update/contrato/versao` aceitando `FormData | Partial<ContractVersion>`
    - _Requirements: 2.3, 2.4_

  - [x] 3.11 Remover lógica de arquivo de `ContractHistory.tsx`
    - Remover `arquivo` e `arquivo_url` do estado `formRegisterContractHistory`
    - Remover handlers `handleFileChangeContract` e `handleDownloadContractFile`
    - Remover `formData.append('arquivo', ...)` de `handleSaveRegisterContractHistory` e `handleSaveEditContract`
    - Remover `<input type="file">` e labels associados dos modais "Registrar Contrato" e "Editar Contrato"
    - Remover ícone de download (`faDownload`) da linha da tabela de contratos e seu import do FontAwesome
    - _Bug_Condition: isBugCondition(context) where context.component = 'ContractHistory' AND formContainsField('arquivo')_
    - _Preservation: demais campos do formulário (tipo, datas, observacao, ativo) e comportamento da tabela devem permanecer inalterados_
    - _Requirements: 2.1, 2.2, 3.1, 3.2_

  - [x] 3.12 Adicionar funcionalidade completa de criação/edição de versão com upload em `ContractHistoryVersion.tsx`
    - Adicionar imports: `faDownload`, `faPenSquare`, `faX` do FontAwesome; `AddButton`; `createContractVersion`, `editContractVersion`; `Bounce`, `toast`, `ToastContainer`; `Box`, `Modal` do MUI; `Checkbox`
    - Adicionar estado `formVersion` com campos: `contrato_id` (inicializado com `contractId`), `data_inicio`, `data_termino`, `observacao`, `arquivo: null`, `versao_id`, `arquivo_url`
    - Adicionar estados de modal: `openRegisterVersion`, `openEditVersion`
    - Adicionar `AddButton` acima da tabela para abrir modal de registro
    - Adicionar coluna "Arquivo" na tabela: ícone `faDownload` condicional quando `version.arquivo_url` existe; ícone `faPenSquare` para abrir edição
    - Adicionar `handleFileChangeVersion` com validação de tamanho (máx 10MB) e tipo (PDF/JPG/JPEG/PNG)
    - Adicionar handlers: `handleSaveRegisterVersion` (chama `createContractVersion`), `handleSaveEditVersion` (chama `editContractVersion`), `handleDownloadVersionFile`
    - Adicionar modais "Registrar Versão" e "Editar Versão" com campos `data_inicio`, `data_termino`, `observacao`, `arquivo`
    - _Expected_Behavior: arquivo_url associado à versão; ícone de download visível por linha de versão com arquivo_
    - _Requirements: 2.3, 2.4, 3.3, 3.5_

  - [x] 3.13 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Arquivo Associado à Versão, Não ao Contrato
    - **IMPORTANT**: Re-run the SAME tests from task 1 - do NOT write new tests
    - The tests from task 1 encode the expected behavior
    - When these tests pass, it confirms the expected behavior is satisfied
    - Run bug condition exploration tests from step 1
    - **EXPECTED OUTCOME**: Tests PASS (confirms bug is fixed)
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 3.14 Verify preservation tests still pass
    - **Property 2: Preservation** - Comportamento de Contrato Sem Arquivo
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)

- [x] 4. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
