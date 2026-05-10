# Requirements Document

## Introduction

A página "Controle de Suportes" está implementada diretamente no componente `athleteDetail.tsx` (`src/pages/secure/athletes/[id]/athleteDetail.tsx`), que já possui mais de 1200 linhas misturando dados do atleta, questionário de relacionamento, controle de suportes, observações, histórico de contratos e aba de mídia.

Além do problema de separação de responsabilidades, a seção "Controle de Suportes" apresenta três bugs:

1. **Paginação não funciona** — o `useEffect` principal usa um guard `effectRan.current` que impede re-execução quando `pageSupportControl` muda.
2. **Itens excluídos reaparecem após refresh** — `handleDeleteControle` chama `setPageSupportControl(1)` e em seguida `getSupportControl(athleteId, pageSupportControl)`, mas como `setPageSupportControl` é assíncrono, `pageSupportControl` ainda tem o valor antigo no momento da chamada.
3. **Tabela não atualiza corretamente após criar novo item** — `handleSalvarClickSupportControl` tem o mesmo problema de estado desatualizado.

A solução envolve extrair toda a seção "Controle de Suportes" para um componente dedicado `SupportControl.tsx`, que terá seu próprio ciclo de vida e corrigirá os três bugs no processo.

## Glossary

- **SupportControl_Component**: O novo componente `src/components/SupportControl.tsx` a ser criado
- **AthleteDetail_Component**: O componente existente `src/pages/secure/athletes/[id]/athleteDetail.tsx`
- **SupportControl_Table**: A tabela "Controle de Suportes" com colunas DATA, NOME, QUANTIDADE, PREÇO e AÇÕES
- **SupportControl_Item**: Um registro individual de controle de suporte, identificado por `controle_id`
- **Pagination_Component**: O componente MUI `<Pagination>` que controla a página atual
- **Delete_Modal**: O modal de confirmação de exclusão de um `SupportControl_Item`
- **Create_Modal**: O modal de criação de novo `SupportControl_Item` com campos data, nome, quantidade, preço e arquivo
- **HTTP_Service**: O módulo `src/lib/http-service/relationship.ts` que expõe `getSupportControl`, `createSupportControl` e `deleteSupportControl`
- **effectRan_guard**: O `useRef(false)` + `if (!effectRan.current)` que atualmente impede o `useEffect` de re-executar quando dependências mudam

## Requirements

### Requirement 1: Extração para Componente Dedicado

**User Story:** Como desenvolvedor, quero que a seção "Controle de Suportes" seja um componente independente, para que o código seja mais fácil de manter e as responsabilidades estejam bem separadas.

#### Acceptance Criteria

1. THE `SupportControl_Component` SHALL ser criado em `src/components/SupportControl.tsx` e receber `athleteId: string` como única prop obrigatória.
2. THE `SupportControl_Component` SHALL encapsular todo o estado, handlers e JSX relacionados ao controle de suportes, incluindo a `SupportControl_Table`, o `Pagination_Component`, o `Create_Modal` e o `Delete_Modal`.
3. THE `AthleteDetail_Component` SHALL substituir o bloco JSX da seção "Controle de Suportes" (linhas 757–853) por `<SupportControl athleteId={athleteId} />`.
4. THE `AthleteDetail_Component` SHALL remover todos os estados, handlers e imports que eram exclusivos do controle de suportes após a extração.
5. WHEN o `SupportControl_Component` é renderizado, THE comportamento visual SHALL ser idêntico ao comportamento atual da seção no `AthleteDetail_Component`.

---

### Requirement 2: Paginação Responsiva

**User Story:** Como usuário da página de Controle de Suportes, quero navegar entre páginas de itens, para que eu possa visualizar todos os registros quando houver mais do que o limite por página.

#### Acceptance Criteria

1. WHEN o usuário clica em uma página diferente no `Pagination_Component`, THE `SupportControl_Component` SHALL atualizar `pageSupportControl` para o novo número de página.
2. WHEN `pageSupportControl` é atualizado, THE `HTTP_Service` SHALL chamar `getSupportControl(athleteId, pageSupportControl)` com o novo valor de página.
3. WHEN `getSupportControl` retorna com sucesso após mudança de página, THE `SupportControl_Component` SHALL atualizar `displayedDataSupportControl`, `totalRowSupportControl` e `displayedTotalValueSupportControl` com os dados retornados.
4. THE `SupportControl_Component` SHALL usar um `useEffect` dedicado com `pageSupportControl` e `athleteId` como dependências, sem `effectRan_guard`, para buscar dados sempre que a página mudar.

---

### Requirement 3: Exclusão Persistente

**User Story:** Como usuário da página de Controle de Suportes, quero que itens excluídos não reapareçam após recarregar a página, para que as exclusões sejam permanentes.

#### Acceptance Criteria

1. WHEN o usuário confirma a exclusão de um `SupportControl_Item`, THE `SupportControl_Component` SHALL chamar `deleteSupportControl(controle_id)` passando o `controle_id` do item selecionado.
2. WHEN `deleteSupportControl` retorna com sucesso, THE `SupportControl_Component` SHALL chamar `getSupportControl(athleteId, 1)` passando o valor literal `1`, não o valor atual de `pageSupportControl`.
3. WHEN `getSupportControl` retorna com sucesso após exclusão, THE `SupportControl_Component` SHALL atualizar `displayedDataSupportControl`, `totalRowSupportControl` e `displayedTotalValueSupportControl` com os dados retornados e resetar `pageSupportControl` para `1`.
4. WHEN o usuário recarrega a página após excluir um `SupportControl_Item`, THE `SupportControl_Component` SHALL não incluir o item excluído em `displayedDataSupportControl`.
5. IF `deleteSupportControl` retornar erro, THEN THE `SupportControl_Component` SHALL manter `displayedDataSupportControl` inalterado e exibir uma mensagem de erro ao usuário via `showErrorToast`.

---

### Requirement 4: Atualização de Estado após Criação

**User Story:** Como usuário da página de Controle de Suportes, quero que a tabela seja atualizada imediatamente após criar um novo item, para que eu veja o registro recém-criado sem precisar recarregar a página.

#### Acceptance Criteria

1. WHEN `createSupportControl` retorna com sucesso, THE `SupportControl_Component` SHALL chamar `getSupportControl(athleteId, 1)` passando o valor literal `1`, não o valor atual de `pageSupportControl`.
2. WHEN `getSupportControl` retorna com sucesso após criação, THE `SupportControl_Component` SHALL atualizar `displayedDataSupportControl`, `totalRowSupportControl` e `displayedTotalValueSupportControl` com os dados retornados e resetar `pageSupportControl` para `1`.
3. IF `createSupportControl` retornar erro, THEN THE `SupportControl_Component` SHALL manter `displayedDataSupportControl` inalterado e exibir uma mensagem de erro ao usuário via `showErrorToast`.
