/**
 * Preservation Property Tests - Property 2
 *
 * Validates: Requirements 3.1, 3.2, 3.3
 *
 * Observation-first methodology:
 * On UNFIXED code, all parent list modals use a single `style` constant with
 * width: '95%' and height: '95%'. These tests capture that baseline behavior
 * and assert it is preserved after the fix is applied.
 *
 * EXPECTED OUTCOME: Tests PASS on both unfixed and fixed code.
 * - On unfixed code: the single `style` constant has 95% x 95% → passes
 * - On fixed code: `styleList` has 95% x 95% → passes (form modals use `styleForm`)
 *
 * Also verifies PerformanceCreation.tsx and ContractHistoryVersion.tsx are
 * completely untouched (no `styleForm` constant introduced).
 */

import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Helpers (same static-analysis approach as bug condition test)
// ---------------------------------------------------------------------------

function extractStyleConstant(source: string, name: string): string | null {
  const regex = new RegExp(`const\\s+${name}\\s*=\\s*\\{([\\s\\S]*?)\\};`, 'm');
  const match = source.match(regex);
  return match ? match[0] : null;
}

function extractProp(styleStr: string, prop: string): string | null {
  const regex = new RegExp(`${prop}\\s*:\\s*(['"][^'"]*['"]|\\d+)`, 'm');
  const match = styleStr.match(regex);
  return match ? match[1].replace(/['"]/g, '') : null;
}

/** Returns the list-modal style constant.
 *  - Unfixed code: single `style` constant
 *  - Fixed code: `styleList` constant
 */
function getListStyleConstant(source: string): string | null {
  const styleList = extractStyleConstant(source, 'styleList');
  if (styleList) return styleList;
  // Fall back to single `style` on unfixed code
  return extractStyleConstant(source, 'style');
}

// ---------------------------------------------------------------------------
// File paths
// ---------------------------------------------------------------------------

const ROOT = path.resolve(__dirname, '../../');

const LIST_MODAL_FILES = {
  clubHistory: path.join(ROOT, 'src/components/modal/ClubHistory.tsx'),
  contractHistory: path.join(ROOT, 'src/components/modal/ContractHistory.tsx'),
  historyCompetitions: path.join(ROOT, 'src/components/modal/HistoryCompetitions.tsx'),
  injuries: path.join(ROOT, 'src/components/modal/Injuries.tsx'),
  physicalHistory: path.join(ROOT, 'src/components/modal/PhysicalHistory.tsx'),
};

const UNCHANGED_FILES = {
  performanceCreation: path.join(ROOT, 'src/components/modal/PerformanceCreation.tsx'),
  contractHistoryVersion: path.join(ROOT, 'src/components/modal/ContractHistoryVersion.tsx'),
};

// ---------------------------------------------------------------------------
// Property 2: Preservation - Parent List Modals Keep 95% x 95% Dimensions
// ---------------------------------------------------------------------------

describe('Property 2: Preservation - Parent List Modals Keep 95% x 95% Dimensions', () => {
  /**
   * For each parent list modal, assert that the list-modal style constant
   * preserves width: '95%' and height: '95%'.
   *
   * On UNFIXED code: the single `style` constant has these values → PASS
   * On FIXED code: `styleList` has these values → PASS
   */

  test('ClubHistory.tsx - list modal style preserves width: 95% and height: 95%', () => {
    const source = fs.readFileSync(LIST_MODAL_FILES.clubHistory, 'utf-8');
    const styleStr = getListStyleConstant(source);

    expect(styleStr).not.toBeNull();

    const width = extractProp(styleStr!, 'width');
    const height = extractProp(styleStr!, 'height');

    expect(width).toBe('95%');
    expect(height).toBe('95%');
  });

  test('ContractHistory.tsx - list modal style preserves width: 95% and height: 95%', () => {
    const source = fs.readFileSync(LIST_MODAL_FILES.contractHistory, 'utf-8');
    const styleStr = getListStyleConstant(source);

    expect(styleStr).not.toBeNull();

    const width = extractProp(styleStr!, 'width');
    const height = extractProp(styleStr!, 'height');

    expect(width).toBe('95%');
    expect(height).toBe('95%');
  });

  test('HistoryCompetitions.tsx - list modal style preserves width: 95% and height: 95%', () => {
    const source = fs.readFileSync(LIST_MODAL_FILES.historyCompetitions, 'utf-8');
    const styleStr = getListStyleConstant(source);

    expect(styleStr).not.toBeNull();

    const width = extractProp(styleStr!, 'width');
    const height = extractProp(styleStr!, 'height');

    expect(width).toBe('95%');
    expect(height).toBe('95%');
  });

  test('Injuries.tsx - list modal style preserves width: 95% and height: 95%', () => {
    const source = fs.readFileSync(LIST_MODAL_FILES.injuries, 'utf-8');
    const styleStr = getListStyleConstant(source);

    expect(styleStr).not.toBeNull();

    const width = extractProp(styleStr!, 'width');
    const height = extractProp(styleStr!, 'height');

    expect(width).toBe('95%');
    expect(height).toBe('95%');
  });

  test('PhysicalHistory.tsx - list modal style preserves width: 95% and height: 95%', () => {
    const source = fs.readFileSync(LIST_MODAL_FILES.physicalHistory, 'utf-8');
    const styleStr = getListStyleConstant(source);

    expect(styleStr).not.toBeNull();

    const width = extractProp(styleStr!, 'width');
    const height = extractProp(styleStr!, 'height');

    expect(width).toBe('95%');
    expect(height).toBe('95%');
  });
});

// ---------------------------------------------------------------------------
// Property 2 (extended): Unchanged files have no styleForm introduced
// ---------------------------------------------------------------------------

describe('Property 2 (extended): PerformanceCreation and ContractHistoryVersion remain untouched', () => {
  /**
   * PerformanceCreation and ContractHistoryVersion must NOT have a `styleForm`
   * constant introduced. They should keep their single `style` constant
   * with width: '95%' and height: '95%' unchanged.
   */

  test('PerformanceCreation.tsx - no styleForm constant (file is untouched)', () => {
    const source = fs.readFileSync(UNCHANGED_FILES.performanceCreation, 'utf-8');
    const hasStyleForm = /const\s+styleForm\s*=/.test(source);
    expect(hasStyleForm).toBe(false);
  });

  test('PerformanceCreation.tsx - style constant preserves width: 95% and height: 95%', () => {
    const source = fs.readFileSync(UNCHANGED_FILES.performanceCreation, 'utf-8');
    const styleStr = extractStyleConstant(source, 'style');

    expect(styleStr).not.toBeNull();

    const width = extractProp(styleStr!, 'width');
    const height = extractProp(styleStr!, 'height');

    expect(width).toBe('95%');
    expect(height).toBe('95%');
  });

  test('ContractHistoryVersion.tsx - styleForm constant uses width: 60% and maxHeight: 90vh (version form modals)', () => {
    // ContractHistoryVersion.tsx was updated by the contract-version-file-upload spec to add
    // version create/edit form modals. It now legitimately has a styleForm constant.
    const source = fs.readFileSync(UNCHANGED_FILES.contractHistoryVersion, 'utf-8');
    const styleStr = extractStyleConstant(source, 'styleForm');

    expect(styleStr).not.toBeNull();

    const width = extractProp(styleStr!, 'width');
    const maxHeight = extractProp(styleStr!, 'maxHeight');

    expect(width).toBe('60%');
    expect(maxHeight).toBe('90vh');
  });

  test('ContractHistoryVersion.tsx - outer container uses overflow auto (list area preserved)', () => {
    // The outer table container uses an inline style with overflow: auto.
    // This verifies the list area layout is preserved after the fix.
    const source = fs.readFileSync(UNCHANGED_FILES.contractHistoryVersion, 'utf-8');
    const hasOverflowAuto = /style=\{\{[^}]*overflow:\s*['"]auto['"]/.test(source);
    expect(hasOverflowAuto).toBe(true);
  });
});
