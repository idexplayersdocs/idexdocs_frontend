# Design Document

## Overview

Extrair a seção "Controle de Suportes" do `AthleteDetail` para um componente dedicado `SupportControl.tsx`, corrigindo os três bugs de paginação e atualização de estado no processo.

A mudança é cirúrgica: apenas o bloco de suporte é movido. O restante de `athleteDetail.tsx` não é alterado.

## Architecture

### Novo arquivo

```
src/components/SupportControl.tsx   ← novo componente
```

### Arquivo modificado

```
src/pages/secure/athletes/[id]/athleteDetail.tsx   ← remove bloco de suporte, adiciona <SupportControl />
```

## Component Design

### `SupportControl` props

```typescript
interface SupportControlProps {
  athleteId: string;
}
```

### Estado interno

```typescript
const [page, setPage] = useState(1);
const [items, setItems] = useState<SupportControl[]>([]);
const [totalRows, setTotalRows] = useState(0);
const [totalValue, setTotalValue] = useState<string>('');
const [openCreate, setOpenCreate] = useState(false);
const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
const [selectedItem, setSelectedItem] = useState<SupportControl | null>(null);
const [isSaving, setIsSaving] = useState(false);
const [formData, setFormData] = useState<SupportControlFormData>({ ... });
```

### Busca de dados — `useEffect` dedicado

O bug de paginação é corrigido removendo o `effectRan_guard` do ciclo de vida do suporte. O componente usa um único `useEffect` com `[athleteId, page]` como dependências:

```typescript
useEffect(() => {
  if (!athleteId) return;
  fetchSupportControl(page);
}, [athleteId, page]);
```

Onde `fetchSupportControl` é uma função interna que chama `getSupportControl` e atualiza o estado.

### Correção do bug de estado desatualizado (delete e create)

O problema em ambos os handlers era chamar `setPage(1)` e em seguida `getSupportControl(athleteId, page)` — como `setPage` é assíncrono, `page` ainda tinha o valor antigo.

A correção é passar `1` diretamente para a função de busca, sem depender do estado:

```typescript
// ❌ Antes (bugado)
setPageSupportControl(1);
const data = await getSupportControl(athleteId, pageSupportControl); // usa valor antigo

// ✅ Depois (correto)
const data = await getSupportControl(athleteId, 1); // passa 1 diretamente
setPage(1); // atualiza estado para sincronizar o Pagination_Component
```

### Handlers

**`fetchSupportControl(pageNum: number)`**
- Chama `getSupportControl(athleteId, pageNum)`
- Atualiza `items`, `totalRows` e `totalValue`

**`handlePageChange(_event, newPage)`**
- Chama `setPage(newPage)` — o `useEffect` reage e busca a nova página

**`handleDelete`**
- Chama `deleteSupportControl(selectedItem.controle_id)`
- Em caso de sucesso: chama `fetchSupportControl(1)` e `setPage(1)`
- Em caso de erro: exibe `showErrorToast`

**`handleCreate`**
- Monta `FormData` e chama `createSupportControl(formData)`
- Em caso de sucesso: chama `fetchSupportControl(1)` e `setPage(1)`
- Em caso de erro: exibe `showErrorToast`

## Changes to `athleteDetail.tsx`

1. Remover os estados exclusivos do suporte: `pageSupportControl`, `displayedDataSupportControl`, `displayedTotalValueSupportControl`, `totalRowSupportControl`, `openCreateSupportControl`, `openConfirmDeleteControl`, `formDataSupportControl`, `formSupportControlSelected`, `isSavingSupportControl`
2. Remover os handlers exclusivos do suporte: `handleDeleteControle`, `handleChangePageSupportControl`, `handleOpenCreateSupportControl`, `handleCloseCreateSupportControl`, `handleOpenConfirmDeleteControl`, `handleCloseConfirmDeleteControl`, `handleSalvarClickSupportControl`, `isFormValidSupportControl`, `handleFileChangeSupportControl`, `handleDownloadFile`, `formatCurrency`, `formatCurrencyForDisplay`, `parseCurrencyToFloat`
3. Remover o import de `deleteSupportControl` e `createSupportControl` (se não usados em outro lugar)
4. Substituir o bloco JSX da seção "Controle de Suportes" (linhas 757–853) e os dois modais relacionados por:

```tsx
<SupportControl athleteId={athleteId} />
```

5. Adicionar o import: `import SupportControl from '@/components/SupportControl';`

## JSX Structure of `SupportControl.tsx`

O componente renderiza:

```
<div>                                    ← container da seção
  <div>                                  ← header com título e botão +
    <Subtitle subtitle='Controle de Suportes' />
    <AddButton onClick={handleOpenCreate} />
  </div>
  <div>                                  ← wrapper da tabela com scroll
    <table>                              ← SupportControl_Table
      <thead> DATA | NOME | QTD | PREÇO | AÇÕES </thead>
      <tbody>
        {items.map(item => (
          <tr>
            <td>data</td>
            <td>nome</td>
            <td>quantidade</td>
            <td>preco (formatado BRL)</td>
            <td>                         ← AÇÕES
              [ícone download se arquivo_url]
              [ícone lixeira → abre Delete_Modal]
            </td>
          </tr>
        ))}
        {items.length === 0 && <tr><td colSpan={5}>Lista vazia</td></tr>}
      </tbody>
    </table>
    <table>                              ← linha de total
      <tbody>
        <tr><th>Total</th><td>{totalValue}</td></tr>
      </tbody>
    </table>
    {totalRows > 3 && <Pagination ... />}
  </div>
</div>

{/* Create_Modal */}
<Modal open={openCreate}>
  ...campos: data, nome, quantidade, preço, arquivo...
  <button onClick={handleCreate}>Salvar</button>
</Modal>

{/* Delete_Modal */}
<Modal open={openConfirmDelete}>
  <Subtitle subtitle={`Certeza que deseja remover ${selectedItem?.nome}`} />
  <button onClick={handleDelete}>Sim</button>
  <button onClick={handleCloseConfirmDelete}>Não</button>
</Modal>
```

## What is NOT changed

- Nenhuma outra seção de `athleteDetail.tsx` é alterada
- O `effectRan_guard` do `useEffect` principal de `athleteDetail.tsx` é mantido (ele carrega dados do atleta, relacionamento e observações — que não têm paginação dinâmica)
- A estrutura visual e os estilos são preservados identicamente
- O `HTTP_Service` (`relationship.ts`) não é alterado
