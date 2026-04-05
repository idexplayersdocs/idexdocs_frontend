# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Form Modals Use Oversized 95% x 95% Dimensions
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate form modals render at 95% x 95% instead of 60% width / auto height
  - **Scoped PBT Approach**: Scope the property to the concrete failing cases - one test per affected form modal
  - Test that each form modal Box sx prop has `width: '60%'` and `maxHeight: '90vh'` (from Bug Condition in design)
  - Affected form modals to test: "Criação do atleta" (athletes/index.tsx), "Registrar Clube" / "Editar Clube" (ClubHistory.tsx), "Registrar Contrato" / "Editar Contrato" (ContractHistory.tsx), "Registrar Competição" / "Editar Competição" (HistoryCompetitions.tsx), "Registrar Lesão" / "Editar Lesão" (Injuries.tsx), "Registrar Físico" (PhysicalHistory.tsx)
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (confirms bug - form modals have `width: '95%'` and `height: '95%'` instead of `width: '60%'` and `maxHeight: '90vh'`)
  - Document counterexamples found (e.g., "ClubHistory register form has width: '95%' instead of '60%'")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 1.2_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Parent List Modals Keep 95% x 95% Dimensions
  - **IMPORTANT**: Follow observation-first methodology
  - Observe: ClubHistory list modal Box sx has `width: '95%'` and `height: '95%'` on unfixed code
  - Observe: ContractHistory, HistoryCompetitions, Injuries, PhysicalHistory list modals all render at 95% x 95% on unfixed code
  - Write property-based tests: for all parent list modals (isBugCondition returns false), the Box sx prop preserves `width: '95%'` and `height: '95%'`
  - Also verify PerformanceCreation.tsx and ContractHistoryVersion.tsx remain completely unchanged (no style constant changes)
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (confirms baseline 95% x 95% behavior to preserve for list modals)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 3. Fix modal size standardization across 6 components

  - [x] 3.1 Update `src/pages/secure/athletes/index.tsx`
    - Replace single `style` constant with `styleList` (95% x 95%) and `styleForm` (60% width, maxHeight: 90vh)
    - Apply `styleList` to the parent athlete list modal Box
    - Apply `styleForm` to the "Criação do atleta" form modal Box
    - _Bug_Condition: isBugCondition(modal) where modal.type == 'registration_form' AND modal.style.width == '95%'_
    - _Expected_Behavior: form modal renders with width: '60%' and maxHeight: '90vh'_
    - _Preservation: athlete list modal continues to render at width: '95%' and height: '95%'_
    - _Requirements: 2.1, 2.2, 3.1, 3.2_

  - [x] 3.2 Update `src/components/modal/ClubHistory.tsx`
    - Replace single `style` constant with `styleList` and `styleForm`
    - Apply `styleList` to the Clubes list modal Box
    - Apply `styleForm` to "Registrar Clube" and "Editar Clube" form modal Boxes
    - _Bug_Condition: isBugCondition(modal) where modal.type IN ['registration_form', 'edit_form']_
    - _Expected_Behavior: form modals render with width: '60%' and maxHeight: '90vh'_
    - _Preservation: Clubes list modal continues at 95% x 95%_
    - _Requirements: 2.1, 2.2, 3.1, 3.2_

  - [x] 3.3 Update `src/components/modal/ContractHistory.tsx`
    - Replace single `style` constant with `styleList` and `styleForm`
    - Apply `styleList` to the Contratos list modal Box
    - Apply `styleForm` to "Registrar Contrato" and "Editar Contrato" form modal Boxes
    - _Bug_Condition: isBugCondition(modal) where modal.type IN ['registration_form', 'edit_form']_
    - _Expected_Behavior: form modals render with width: '60%' and maxHeight: '90vh'_
    - _Preservation: Contratos list modal continues at 95% x 95%_
    - _Requirements: 2.1, 2.2, 3.1, 3.2_

  - [x] 3.4 Update `src/components/modal/HistoryCompetitions.tsx`
    - Replace single `style` constant with `styleList` and `styleForm`
    - Apply `styleList` to the Competições list modal Box
    - Apply `styleForm` to "Registrar Competição" and "Editar Competição" form modal Boxes
    - _Bug_Condition: isBugCondition(modal) where modal.type IN ['registration_form', 'edit_form']_
    - _Expected_Behavior: form modals render with width: '60%' and maxHeight: '90vh'_
    - _Preservation: Competições list modal continues at 95% x 95%_
    - _Requirements: 2.1, 2.2, 3.1, 3.2_

  - [x] 3.5 Update `src/components/modal/Injuries.tsx`
    - Replace single `style` constant with `styleList` and `styleForm`
    - Apply `styleList` to the Lesões list modal Box
    - Apply `styleForm` to "Registrar Lesão" and "Editar Lesão" form modal Boxes
    - _Bug_Condition: isBugCondition(modal) where modal.type IN ['registration_form', 'edit_form']_
    - _Expected_Behavior: form modals render with width: '60%' and maxHeight: '90vh'_
    - _Preservation: Lesões list modal continues at 95% x 95%_
    - _Requirements: 2.1, 2.2, 3.1, 3.2_

  - [x] 3.6 Update `src/components/modal/PhysicalHistory.tsx`
    - Replace single `style` constant with `styleList` and `styleForm`
    - Apply `styleList` to the Físico list modal Box
    - Apply `styleForm` to the "Registrar Físico" form modal Box
    - _Bug_Condition: isBugCondition(modal) where modal.type == 'registration_form'_
    - _Expected_Behavior: form modal renders with width: '60%' and maxHeight: '90vh'_
    - _Preservation: Físico list modal continues at 95% x 95%_
    - _Requirements: 2.1, 2.2, 3.1, 3.2_

  - [x] 3.7 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Form Modals Use Standardized Dimensions
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior (width: '60%', maxHeight: '90vh')
    - When this test passes, it confirms all 6 components have the correct styleForm applied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed across all 6 files)
    - _Requirements: 2.1, 2.2_

  - [x] 3.8 Verify preservation tests still pass
    - **Property 2: Preservation** - Parent List Modals Keep 95% x 95% Dimensions
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions in list modal sizing)
    - Confirm PerformanceCreation.tsx and ContractHistoryVersion.tsx are untouched
    - _Requirements: 3.1, 3.2, 3.3_

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Fix additional form modals and inner container layout issues
  - **Scope expansion**: Additional form modals not covered in the original fix were identified
  - **Layout fix**: Inner form row divs had hardcoded pixel heights causing vertical scroll after modal width reduction

  - [x] 5.1 Fix inner container heights across all form modals
    - Replace `height: '400px'`, `height: '300px'`, `height: '250px'`, `height: '520px'` with `height: 'auto'` on inner row divs
    - Affected files: ClubHistory.tsx (Register + Edit), Injuries.tsx (Register + Edit), ContractHistory.tsx (Register + Edit), HistoryCompetitions.tsx (Register + Edit), PhysicalHistory.tsx (Register), athletes/index.tsx (Create), EditAthlete.tsx, Relationship.tsx (Questionary + Support Control)
    - _Requirements: 2.3_

  - [x] 5.2 Apply `styleForm` to `src/components/Relationship.tsx`
    - Add `styleForm` constant (60% width, maxHeight: 90vh)
    - Apply `styleForm` to "Criar Questionário de relacionamento" modal Box
    - Apply `styleForm` to "Criar Controle de Suporte" modal Box
    - _Requirements: 2.1, 2.2_

  - [x] 5.3 Apply `styleForm` to `src/components/SideBar.tsx`
    - Add `styleForm` constant (60% width, maxHeight: 90vh)
    - Apply `styleForm` to "Editar do atleta" modal Box
    - _Requirements: 2.1, 2.2_

  - [x] 5.4 Apply `styleForm` to `src/pages/secure/athletes/[id]/athleteDetail.tsx`
    - Add `styleForm` constant (60% width, maxHeight: 90vh)
    - Apply `styleForm` to "Criar Questionário de relacionamento" modal Box
    - Note: "Criar Controle de Suporte" already uses `styleSupportControl` with correct responsive sizing
    - Note: "Histórico de Contratos" wraps a list modal component — correctly keeps `style` (95%)
    - _Requirements: 2.1, 2.2_
