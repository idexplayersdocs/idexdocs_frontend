# Implementation Plan: Controle de Suporte — Extração e Bugfix

## Overview

Extrair a seção "Controle de Suportes" de `athleteDetail.tsx` para um componente dedicado `SupportControl.tsx`, corrigindo os três bugs (paginação, estado desatualizado no delete e no create) no processo. A mudança é cirúrgica: apenas o bloco de suporte é movido; o restante de `athleteDetail.tsx` não é alterado.

## Tasks

- [x] 1. Criar o componente `SupportControl.tsx`
  - [x] 1.1 Criar o arquivo `src/components/SupportControl.tsx` com a interface de props, estado interno e `useEffect` dedicado
    - Definir `interface SupportControlProps { athleteId: string }`
    - Declarar todos os estados internos: `page`, `items`, `totalRows`, `totalValue`, `openCreate`, `openConfirmDelete`, `selectedItem`, `isSaving`, `formData`
    - Implementar `useEffect([athleteId, page])` sem `effectRan_guard` que chama `fetchSupportControl(page)`
    - Implementar `fetchSupportControl(pageNum: number)` que chama `getSupportControl` e atualiza `items`, `totalRows` e `totalValue`
    - _Requirements: 1.1, 1.2, 2.4_

  - [x] 1.2 Implementar os handlers de paginação e formulário
    - Implementar `handlePageChange(_event, newPage)` que chama `setPage(newPage)`
    - Implementar `handleInputChangeSupportControl` com tratamento especial para o campo `preco` (reutilizar `formatCurrency`)
    - Implementar `handleFileChangeSupportControl` com validação de tamanho (10 MB) e tipo (PDF, JPG, JPEG, PNG)
    - Implementar `isFormValidSupportControl` verificando todos os campos obrigatórios incluindo arquivo
    - Implementar `formatCurrency`, `formatCurrencyForDisplay` e `parseCurrencyToFloat` (mover de `athleteDetail.tsx`)
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 1.3 Implementar `handleDelete` com a correção do bug de estado desatualizado
    - Chamar `deleteSupportControl(selectedItem.controle_id)`
    - Em caso de sucesso: chamar `fetchSupportControl(1)` (passando `1` diretamente) e depois `setPage(1)`
    - Em caso de erro: chamar `showErrorToast` e manter `items` inalterado
    - _Requirements: 3.1, 3.2, 3.3, 3.5_

  - [x] 1.4 Implementar `handleCreate` com a correção do bug de estado desatualizado
    - Montar `FormData` e chamar `createSupportControl(formData)`
    - Em caso de sucesso: chamar `fetchSupportControl(1)` (passando `1` diretamente) e depois `setPage(1)`
    - Em caso de erro: chamar `showErrorToast` e manter `items` inalterado
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 1.5 Implementar o JSX do componente
    - Renderizar o header com `<Subtitle subtitle='Controle de Suportes' />` e `<AddButton />`
    - Renderizar a `SupportControl_Table` com colunas DATA, NOME, QUANTIDADE, PREÇO e AÇÕES
    - Renderizar a linha de total abaixo da tabela
    - Renderizar `<Pagination />` condicionalmente quando `totalRows > 3`
    - Renderizar o `Create_Modal` com todos os campos (data, nome, quantidade, preço, arquivo)
    - Renderizar o `Delete_Modal` com botões de confirmação
    - Preservar os estilos e classes CSS existentes (`styleSupportControl`, `styleDelete`, `styleForm`)
    - _Requirements: 1.2, 1.5_

- [x] 2. Checkpoint — Verificar o componente isolado
  - Garantir que o componente compila sem erros de TypeScript.
  - Verificar que todos os imports estão corretos (`getSupportControl`, `createSupportControl`, `deleteSupportControl`, `SupportControl` type, `Subtitle`, `AddButton`, `Pagination`, `Modal`, `showSuccessToast`, `showErrorToast`, `moment`).
  - Perguntar ao usuário se há dúvidas antes de continuar.

- [x] 3. Atualizar `athleteDetail.tsx`
  - [x] 3.1 Remover estados e handlers exclusivos do controle de suportes
    - Remover os estados: `pageSupportControl`, `displayedDataSupportControl`, `displayedTotalValueSupportControl`, `totalRowSupportControl`, `openCreateSupportControl`, `openConfirmDeleteControl`, `formDataSupportControl`, `formSupportControlSelected`, `isSavingSupportControl`
    - Remover os handlers: `handleDeleteControle`, `handleChangePageSupportControl`, `handleOpenCreateSupportControl`, `handleCloseCreateSupportControl`, `handleOpenConfirmDeleteControl`, `handleCloseConfirmDeleteControl`, `handleSalvarClickSupportControl`, `isFormValidSupportControl`, `handleFileChangeSupportControl`, `handleDownloadFile`, `formatCurrency`, `formatCurrencyForDisplay`, `parseCurrencyToFloat`
    - _Requirements: 1.4_

  - [x] 3.2 Substituir o bloco JSX e adicionar o import do novo componente
    - Substituir o bloco JSX da seção "Controle de Suportes" (incluindo os dois modais relacionados) por `<SupportControl athleteId={athleteId} />`
    - Adicionar `import SupportControl from '@/components/SupportControl'`
    - Remover os imports de `deleteSupportControl` e `createSupportControl` se não forem mais usados em `athleteDetail.tsx`
    - _Requirements: 1.3, 1.4_

- [x] 4. Checkpoint final — Garantir que tudo passa
  - Garantir que `athleteDetail.tsx` compila sem erros de TypeScript.
  - Garantir que `SupportControl.tsx` compila sem erros de TypeScript.
  - Verificar que não há estados ou handlers órfãos em `athleteDetail.tsx`.
  - Perguntar ao usuário se há dúvidas antes de finalizar.

## Notes

- Não há seção de "Correctness Properties" no design — os bugs são de timing de estado assíncrono, não de lógica algorítmica. Testes unitários de componente React seriam adequados mas estão fora do escopo desta extração.
- A correção central dos três bugs é a mesma: passar `1` diretamente para `fetchSupportControl` em vez de depender do valor de `page` após `setPage(1)`.
- O `effectRan_guard` em `athleteDetail.tsx` é mantido intacto — ele protege o carregamento inicial de dados do atleta, relacionamento e observações.
- Todos os estilos (`styleSupportControl`, `styleDelete`, `styleForm`) devem ser movidos para `SupportControl.tsx` ou definidos localmente no novo componente.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4"] },
    { "id": 2, "tasks": ["1.5"] },
    { "id": 3, "tasks": ["3.1"] },
    { "id": 4, "tasks": ["3.2"] }
  ]
}
```
