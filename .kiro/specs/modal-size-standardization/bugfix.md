# Bugfix Requirements Document

## Introduction

This bugfix addresses inconsistent modal sizing for data input forms across the application. Currently, registration and edit modals use oversized dimensions (95% width and 95% height), creating an inconsistent user experience. These form modals should be standardized to a smaller, more appropriate size for data input operations.

The affected components include:
- src/pages/secure/athletes/index.tsx (Athlete creation modal - "Criação do atleta")
- ClubHistory.tsx (Register/Edit Club forms - nested modals)
- ContractHistory.tsx (Register/Edit Contract forms - nested modals)
- HistoryCompetitions.tsx (Register/Edit Competition forms - nested modals)
- Injuries.tsx (Register/Edit Injury forms - nested modals)
- PhysicalHistory.tsx (Register Physical characteristics form - nested modal)
- Relationship.tsx ("Criar Questionário de relacionamento" and "Criar Controle de Suporte" modals)
- SideBar.tsx ("Editar do atleta" modal)
- src/pages/secure/athletes/[id]/athleteDetail.tsx ("Criar Questionário de relacionamento" modal)

**Note:** `PerformanceCreation.tsx` and `ContractHistoryVersion.tsx` do NOT need changes — they display complex multi-column forms or tables that benefit from the full 95% width.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a user opens a registration or edit form modal (e.g., "Criação do atleta", "Registrar Clube", "Editar Competição", "Registrar Lesão", "Criar Questionário de relacionamento", "Editar do atleta") THEN the system displays the modal at 95% width and 95% height

1.2 WHEN multiple form modals are opened across different features THEN the system applies inconsistent sizing as each uses the same oversized dimensions regardless of content requirements

1.3 WHEN a form modal is resized to 60% width with a fixed inner container height (e.g., `height: '400px'`), the form content overflows and causes vertical scroll, and inputs are stacked in a single column instead of a grid layout

### Expected Behavior (Correct)

2.1 WHEN a user opens a registration or edit form modal THEN the system SHALL display the modal at a standardized smaller size appropriate for data input forms (60% width, auto height with max-height: 90vh)

2.2 WHEN multiple form modals are opened across different features THEN the system SHALL apply consistent standardized dimensions to all data input form modals

2.3 WHEN a form modal is displayed at 60% width THEN the inner form container SHALL use `height: auto` (not a fixed pixel height) so that content is not clipped and no unnecessary vertical scroll is introduced

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user opens a parent list modal (ClubHistory, ContractHistory, HistoryCompetitions, Injuries, PhysicalHistory, PerformanceCreation, ContractHistoryVersion) THEN the system SHALL CONTINUE TO display these modals at 95% width and 95% height

3.2 WHEN a user interacts with modal content, form fields, and save/cancel buttons THEN the system SHALL CONTINUE TO function identically with all existing functionality preserved

3.3 WHEN a user closes modals or navigates between parent and nested modals THEN the system SHALL CONTINUE TO handle modal state management as currently implemented
