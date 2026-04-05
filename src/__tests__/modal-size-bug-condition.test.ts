/**
 * Bug Condition Exploration Test - Property 1
 *
 * Validates: Requirements 1.1, 1.2
 *
 * CRITICAL: This test MUST FAIL on unfixed code.
 * Failure confirms the bug exists: form modals use oversized 95% x 95% dimensions
 * instead of the expected 60% width / maxHeight: 90vh.
 *
 * When the fix is applied (Task 3), this test will PASS, confirming the bug is resolved.
 *
 * Static analysis approach: reads source files as text and inspects the style
 * constant(s) used for form modal Boxes. No rendering required.
 */

import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Extract the value of a named style constant from source text.
 * Returns the raw object literal string for the constant, or null if not found.
 */
function extractStyleConstant(source: string, name: string): string | null {
  // Match: const <name> = { ... }; (handles multi-line)
  const regex = new RegExp(`const\\s+${name}\\s*=\\s*\\{([\\s\\S]*?)\\};`, 'm');
  const match = source.match(regex);
  if (!match) return null;
  return match[0];
}

/**
 * Extract the value of a specific CSS property from a style constant string.
 * e.g. extractProp(styleStr, 'width') => "'60%'"
 */
function extractProp(styleStr: string, prop: string): string | null {
  const regex = new RegExp(`${prop}\\s*:\\s*(['"][^'"]*['"]|\\d+)`, 'm');
  const match = styleStr.match(regex);
  if (!match) return null;
  return match[1].replace(/['"]/g, '');
}

/**
 * Check whether a source file defines a `styleForm` constant (post-fix pattern).
 */
function hasStyleForm(source: string): boolean {
  return /const\s+styleForm\s*=/.test(source);
}

// ---------------------------------------------------------------------------
// File paths
// ---------------------------------------------------------------------------

const ROOT = path.resolve(__dirname, '../../');

const FILES = {
  athletes: path.join(ROOT, 'src/pages/secure/athletes/index.tsx'),
  clubHistory: path.join(ROOT, 'src/components/modal/ClubHistory.tsx'),
  contractHistory: path.join(ROOT, 'src/components/modal/ContractHistory.tsx'),
  historyCompetitions: path.join(ROOT, 'src/components/modal/HistoryCompetitions.tsx'),
  injuries: path.join(ROOT, 'src/components/modal/Injuries.tsx'),
  physicalHistory: path.join(ROOT, 'src/components/modal/PhysicalHistory.tsx'),
};

// ---------------------------------------------------------------------------
// Helper: get the form style constant from a source file.
// On unfixed code there is only `style`; on fixed code there is `styleForm`.
// ---------------------------------------------------------------------------

function getFormStyleConstant(source: string): string | null {
  if (hasStyleForm(source)) {
    return extractStyleConstant(source, 'styleForm');
  }
  // Unfixed code: single `style` constant used for all modals (including forms)
  return extractStyleConstant(source, 'style');
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Property 1: Bug Condition - Form Modals Use Oversized 95% x 95% Dimensions', () => {
  /**
   * For each affected form modal, assert that the style constant used for
   * form modal Boxes has width: '60%' and maxHeight: '90vh'.
   *
   * On UNFIXED code these assertions FAIL because the single `style` constant
   * has width: '95%' and height: '95%' (no maxHeight).
   */

  test('athletes/index.tsx - "Criação do atleta" form modal should use width: 60% and maxHeight: 90vh', () => {
    const source = fs.readFileSync(FILES.athletes, 'utf-8');
    const styleStr = getFormStyleConstant(source);

    expect(styleStr).not.toBeNull();

    const width = extractProp(styleStr!, 'width');
    const maxHeight = extractProp(styleStr!, 'maxHeight');

    // Expected (fixed) behavior
    expect(width).toBe('60%');
    expect(maxHeight).toBe('90vh');
  });

  test('ClubHistory.tsx - "Registrar Clube" form modal should use width: 60% and maxHeight: 90vh', () => {
    const source = fs.readFileSync(FILES.clubHistory, 'utf-8');
    const styleStr = getFormStyleConstant(source);

    expect(styleStr).not.toBeNull();

    const width = extractProp(styleStr!, 'width');
    const maxHeight = extractProp(styleStr!, 'maxHeight');

    expect(width).toBe('60%');
    expect(maxHeight).toBe('90vh');
  });

  test('ClubHistory.tsx - "Editar Clube" form modal should use width: 60% and maxHeight: 90vh', () => {
    // Same style constant governs both register and edit form modals in ClubHistory
    const source = fs.readFileSync(FILES.clubHistory, 'utf-8');
    const styleStr = getFormStyleConstant(source);

    expect(styleStr).not.toBeNull();

    const width = extractProp(styleStr!, 'width');
    const maxHeight = extractProp(styleStr!, 'maxHeight');

    expect(width).toBe('60%');
    expect(maxHeight).toBe('90vh');
  });

  test('ContractHistory.tsx - "Registrar Contrato" form modal should use width: 60% and maxHeight: 90vh', () => {
    const source = fs.readFileSync(FILES.contractHistory, 'utf-8');
    const styleStr = getFormStyleConstant(source);

    expect(styleStr).not.toBeNull();

    const width = extractProp(styleStr!, 'width');
    const maxHeight = extractProp(styleStr!, 'maxHeight');

    expect(width).toBe('60%');
    expect(maxHeight).toBe('90vh');
  });

  test('ContractHistory.tsx - "Editar Contrato" form modal should use width: 60% and maxHeight: 90vh', () => {
    const source = fs.readFileSync(FILES.contractHistory, 'utf-8');
    const styleStr = getFormStyleConstant(source);

    expect(styleStr).not.toBeNull();

    const width = extractProp(styleStr!, 'width');
    const maxHeight = extractProp(styleStr!, 'maxHeight');

    expect(width).toBe('60%');
    expect(maxHeight).toBe('90vh');
  });

  test('HistoryCompetitions.tsx - "Registrar Competição" form modal should use width: 60% and maxHeight: 90vh', () => {
    const source = fs.readFileSync(FILES.historyCompetitions, 'utf-8');
    const styleStr = getFormStyleConstant(source);

    expect(styleStr).not.toBeNull();

    const width = extractProp(styleStr!, 'width');
    const maxHeight = extractProp(styleStr!, 'maxHeight');

    expect(width).toBe('60%');
    expect(maxHeight).toBe('90vh');
  });

  test('HistoryCompetitions.tsx - "Editar Competição" form modal should use width: 60% and maxHeight: 90vh', () => {
    const source = fs.readFileSync(FILES.historyCompetitions, 'utf-8');
    const styleStr = getFormStyleConstant(source);

    expect(styleStr).not.toBeNull();

    const width = extractProp(styleStr!, 'width');
    const maxHeight = extractProp(styleStr!, 'maxHeight');

    expect(width).toBe('60%');
    expect(maxHeight).toBe('90vh');
  });

  test('Injuries.tsx - "Registrar Lesão" form modal should use width: 60% and maxHeight: 90vh', () => {
    const source = fs.readFileSync(FILES.injuries, 'utf-8');
    const styleStr = getFormStyleConstant(source);

    expect(styleStr).not.toBeNull();

    const width = extractProp(styleStr!, 'width');
    const maxHeight = extractProp(styleStr!, 'maxHeight');

    expect(width).toBe('60%');
    expect(maxHeight).toBe('90vh');
  });

  test('Injuries.tsx - "Editar Lesão" form modal should use width: 60% and maxHeight: 90vh', () => {
    const source = fs.readFileSync(FILES.injuries, 'utf-8');
    const styleStr = getFormStyleConstant(source);

    expect(styleStr).not.toBeNull();

    const width = extractProp(styleStr!, 'width');
    const maxHeight = extractProp(styleStr!, 'maxHeight');

    expect(width).toBe('60%');
    expect(maxHeight).toBe('90vh');
  });

  test('PhysicalHistory.tsx - "Registrar Físico" form modal should use width: 60% and maxHeight: 90vh', () => {
    const source = fs.readFileSync(FILES.physicalHistory, 'utf-8');
    const styleStr = getFormStyleConstant(source);

    expect(styleStr).not.toBeNull();

    const width = extractProp(styleStr!, 'width');
    const maxHeight = extractProp(styleStr!, 'maxHeight');

    expect(width).toBe('60%');
    expect(maxHeight).toBe('90vh');
  });
});
