# Modal Size Standardization Bugfix Design

## Overview

This bugfix addresses inconsistent modal sizing for data input forms across the application. Currently, all modals (both parent list modals and nested form modals) use oversized dimensions (95% width and 95% height), creating a poor user experience for data input operations. The fix will standardize form modals to use smaller, more appropriate dimensions (60% width, auto height with max-height constraint) while preserving the existing 95% dimensions for parent list modals.

The fix involves updating the `style` constant in 8 affected components to conditionally apply different dimensions based on modal type (list vs form).

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when form modals (registration/edit) are displayed with oversized 95% dimensions
- **Property (P)**: The desired behavior when form modals are opened - they should display at standardized smaller dimensions (60% width, auto/constrained height)
- **Preservation**: Existing parent list modal sizing (95% x 95%) and all modal functionality that must remain unchanged by the fix
- **Parent List Modal**: A modal that displays a table/list of data with pagination (e.g., ClubHistory, ContractHistory, Injuries list views)
- **Form Modal**: A nested modal that contains input fields for creating or editing a single record (e.g., "Registrar Clube", "Editar Lesão")
- **style constant**: The MUI Box sx prop object that defines modal dimensions and positioning

## Bug Details

### Bug Condition

The bug manifests when a user opens any registration or edit form modal across the application. The modal rendering logic applies the same oversized dimensions (95% width and 95% height) to all modals regardless of their content type or purpose.

**Formal Specification:**
```
FUNCTION isBugCondition(modal)
  INPUT: modal of type ModalComponent
  OUTPUT: boolean
  
  RETURN modal.type IN ['registration_form', 'edit_form']
         AND modal.style.width == '95%'
         AND modal.style.height == '95%'
         AND modal.contentType == 'data_input_form'
END FUNCTION
```

### Examples

- **Athlete Creation Modal** (`src/pages/secure/athletes/index.tsx`): When clicking "Add" button to create a new athlete, the "Criação do atleta" modal opens at 95% x 95%, but only contains 6 form fields and an image upload - Expected: 60% width, auto height
- **Register Club Modal** (`ClubHistory.tsx`): When clicking "Add" in the Clubes list modal, the "Registrar Clube" nested modal opens at 95% x 95%, but only contains 4 form fields - Expected: 60% width, auto height
- **Edit Injury Modal** (`Injuries.tsx`): When clicking edit icon in the Lesões list, the "Editar Lesão" nested modal opens at 95% x 95%, but only contains 3 form fields - Expected: 60% width, auto height
- **Register Competition Modal** (`HistoryCompetitions.tsx`): When clicking "Add" in the Competições list, the "Registrar Competição" nested modal opens at 95% x 95%, but contains 7 form fields in 2 columns - Expected: 60% width, auto height

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Parent list modals (ClubHistory, ContractHistory, HistoryCompetitions, Injuries, PhysicalHistory, PerformanceCreation) must continue displaying at 95% width and 95% height
- All modal functionality (open/close, form submission, validation, data fetching) must continue to work identically
- Modal positioning (centered), border styling, padding, and overflow behavior must remain unchanged
- Nested modal hierarchy and state management must continue to function as currently implemented

**Scope:**
All modals that display lists/tables with pagination should be completely unaffected by this fix. This includes:
- The main list view in ClubHistory, ContractHistory, HistoryCompetitions, Injuries, PhysicalHistory
- The ContractHistoryVersion modal (displays version history table)
- The PerformanceCreation modal (displays a complex multi-column form that needs full space)

## Hypothesized Root Cause

Based on the bug description and code analysis, the root cause is:

1. **Single Style Constant Pattern**: Each component defines a single `style` constant with hardcoded 95% dimensions that is applied to ALL modals in that component, regardless of whether it's a list modal or a form modal.

2. **No Differentiation Between Modal Types**: The code does not distinguish between parent list modals (which need large dimensions for tables) and nested form modals (which need smaller dimensions for data input).

3. **Copy-Paste Pattern**: The same `style` constant pattern was replicated across all modal components, propagating the oversized dimensions to all form modals.

4. **MUI Box sx Prop**: The style is applied via the `sx` prop on MUI's `<Box>` component, which accepts inline style objects. The fix requires creating separate style constants for different modal types.

5. **Fixed Inner Container Heights**: Several form modals also had hardcoded pixel heights (e.g., `height: '400px'`, `height: '250px'`) on the inner row `<div>`. When the modal width was reduced to 60%, these fixed heights caused unnecessary vertical scroll and prevented the form from naturally sizing to its content. The fix replaces these with `height: 'auto'`.

## Correctness Properties

Property 1: Bug Condition - Form Modals Use Standardized Dimensions

_For any_ modal where the bug condition holds (form modal for registration or editing), the fixed code SHALL display the modal at 60% width with auto height (max-height: 90vh) and maintain centered positioning, proper overflow handling, and all existing styling properties.

**Validates: Requirements 2.1, 2.2**

Property 2: Preservation - Parent List Modal Dimensions

_For any_ modal that is NOT a form modal (parent list modals displaying tables/lists), the fixed code SHALL produce exactly the same rendering as the original code, preserving the 95% width and 95% height dimensions and all existing functionality.

**Validates: Requirements 3.1, 3.2, 3.3**

## Fix Implementation

### Changes Required

The fix requires updating 8 component files to use separate style constants for list modals vs form modals.

**Files to Modify:**

1. `src/pages/secure/athletes/index.tsx` - Athlete creation modal
2. `src/components/modal/ClubHistory.tsx` - Register/Edit Club forms
3. `src/components/modal/ContractHistory.tsx` - Register/Edit Contract forms
4. `src/components/modal/HistoryCompetitions.tsx` - Register/Edit Competition forms
5. `src/components/modal/Injuries.tsx` - Register/Edit Injury forms
6. `src/components/modal/PhysicalHistory.tsx` - Register Physical characteristics form
7. `src/components/Relationship.tsx` - "Criar Questionário de relacionamento" and "Criar Controle de Suporte" forms
8. `src/components/SideBar.tsx` - "Editar do atleta" form
9. `src/pages/secure/athletes/[id]/athleteDetail.tsx` - "Criar Questionário de relacionamento" form

**Note:** `PerformanceCreation.tsx` and `ContractHistoryVersion.tsx` do NOT need changes:
- `PerformanceCreation.tsx` is a complex multi-column form that benefits from the full 95% width
- `ContractHistoryVersion.tsx` displays a table/list, so it should keep 95% dimensions

**Specific Changes for Each File:**

1. **Create Two Style Constants**: Replace the single `style` constant with two:
   - `styleList`: Keep existing 95% x 95% dimensions for parent list modals
   - `styleForm`: New 60% width, auto height with max-height: 90vh for form modals

2. **Apply Correct Style to Each Modal**:
   - Parent list modal (main modal in component): Use `styleList`
   - Registration form modals: Use `styleForm`
   - Edit form modals: Use `styleForm`

3. **Preserve All Other Style Properties**: Both style constants must maintain:
   - `position: 'absolute' as 'absolute'`
   - `top: '50%'`, `left: '50%'`, `transform: 'translate(-50%, -50%)'`
   - `bgcolor: 'var(--bg-primary-color)'`
   - `border: '1px solid var(--color-line)'`
   - `boxShadow: 24`
   - `p: 4`
   - `borderRadius: '20px'`
   - `overflow: 'auto'`

**Example Implementation Pattern:**

```typescript
// Replace single style constant
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  bgcolor: 'var(--bg-primary-color)',
  border: '1px solid var(--color-line)',
  boxShadow: 24,
  p: 4,
  borderRadius: '20px',
  height: '95%',
  overflow: 'auto'
};

// With two style constants
const styleList = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  bgcolor: 'var(--bg-primary-color)',
  border: '1px solid var(--color-line)',
  boxShadow: 24,
  p: 4,
  borderRadius: '20px',
  height: '95%',
  overflow: 'auto'
};

const styleForm = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  bgcolor: 'var(--bg-primary-color)',
  border: '1px solid var(--color-line)',
  boxShadow: 24,
  p: 4,
  borderRadius: '20px',
  maxHeight: '90vh',
  overflow: 'auto'
};

// Then update Modal components:
// Parent list modal
<Modal ...>
  <Box sx={styleList}>
    {/* List/table content */}
  </Box>
</Modal>

// Form modals
<Modal ...>
  <Box sx={styleForm}>
    {/* Form content */}
  </Box>
</Modal>
```

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code by verifying oversized form modal dimensions, then verify the fix applies correct dimensions to form modals while preserving parent list modal dimensions.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm that form modals are rendered with oversized 95% x 95% dimensions.

**Test Plan**: Write tests that render each form modal and measure the computed dimensions of the modal container. Run these tests on the UNFIXED code to observe that all form modals use 95% x 95% dimensions.

**Test Cases**:
1. **Athlete Creation Modal Test**: Render the "Criação do atleta" modal and assert it has 95% width and 95% height (will fail on unfixed code - should be 60% width)
2. **Register Club Modal Test**: Render the "Registrar Clube" modal and assert it has 95% width and 95% height (will fail on unfixed code - should be 60% width)
3. **Edit Injury Modal Test**: Render the "Editar Lesão" modal and assert it has 95% width and 95% height (will fail on unfixed code - should be 60% width)
4. **Register Competition Modal Test**: Render the "Registrar Competição" modal and assert it has 95% width and 95% height (will fail on unfixed code - should be 60% width)

**Expected Counterexamples**:
- All form modals render with 95% width and 95% height instead of 60% width and auto height
- Form modals appear oversized with excessive whitespace around form fields
- Possible causes: single style constant applied to all modals, no differentiation between list and form modals

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds (form modals), the fixed code produces the expected behavior (60% width, auto height with max-height constraint).

**Pseudocode:**
```
FOR ALL modal WHERE isBugCondition(modal) DO
  result := renderModal_fixed(modal)
  ASSERT result.width == '60%'
  ASSERT result.maxHeight == '90vh'
  ASSERT result.overflow == 'auto'
  ASSERT result.position == 'centered'
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold (parent list modals), the fixed code produces the same result as the original code.

**Pseudocode:**
```
FOR ALL modal WHERE NOT isBugCondition(modal) DO
  ASSERT renderModal_original(modal) = renderModal_fixed(modal)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across different modal types
- It catches edge cases that manual unit tests might miss (e.g., nested modal interactions, different viewport sizes)
- It provides strong guarantees that behavior is unchanged for all parent list modals

**Test Plan**: Observe behavior on UNFIXED code first for parent list modals, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Parent List Modal Preservation**: Observe that ClubHistory, ContractHistory, Injuries, HistoryCompetitions, PhysicalHistory list modals render at 95% x 95% on unfixed code, then verify this continues after fix
2. **Modal Functionality Preservation**: Observe that modal open/close, form submission, validation, and data fetching work correctly on unfixed code, then verify this continues after fix
3. **Nested Modal Hierarchy Preservation**: Observe that opening nested modals (e.g., opening "Registrar Clube" from ClubHistory) works correctly on unfixed code, then verify this continues after fix
4. **Responsive Behavior Preservation**: Observe that modals adapt to different viewport sizes on unfixed code, then verify this continues after fix

### Unit Tests

- Test that form modals render with 60% width and auto height with max-height: 90vh
- Test that parent list modals render with 95% width and 95% height
- Test that all modals maintain centered positioning and proper overflow handling
- Test that modal styling properties (border, padding, border-radius, background) are preserved
- Test edge cases: very small forms (3 fields), medium forms (6 fields), larger forms (7+ fields)

### Property-Based Tests

- Generate random form modal configurations and verify they all render at 60% width
- Generate random list modal configurations and verify they all render at 95% x 95%
- Test that modal dimensions remain consistent across different viewport sizes
- Test that nested modal interactions work correctly with mixed dimension styles

### Integration Tests

- Test full user flow: open parent list modal → click Add → verify form modal opens at correct size → submit form → verify list modal still at correct size
- Test edit flow: open parent list modal → click edit icon → verify edit form modal opens at correct size → save changes → verify list modal still at correct size
- Test multiple nested modals: open ContractHistory → open ContractHistoryVersion → verify both maintain correct dimensions
- Test visual regression: capture screenshots of all modals before and after fix to verify only dimensions changed, not styling or layout
