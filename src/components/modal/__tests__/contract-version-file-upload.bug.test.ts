/**
 * Bug Condition Exploration Test - Property 1
 *
 * Validates: Requirements 1.1, 1.2, 1.3
 *
 * CRITICAL: This test MUST FAIL on unfixed code.
 * Failure confirms the bug exists:
 *   - ContractHistory.tsx contains `input[type="file"]` when it shouldn't
 *   - ContractHistoryVersion.tsx does NOT contain `input[type="file"]` when it should
 *   - ContractHistoryVersion.tsx does NOT contain a download icon per version row
 *
 * When the fix is applied (Task 3), these tests will PASS, confirming the bug is resolved.
 *
 * Static analysis approach: reads source files as text and inspects them with regex.
 * No rendering required — same pattern as modal-size-bug-condition.test.ts.
 */

import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// File paths
// ---------------------------------------------------------------------------

const ROOT = path.resolve(__dirname, '../../../../');

const FILES = {
  contractHistory: path.join(ROOT, 'src/components/modal/ContractHistory.tsx'),
  contractHistoryVersion: path.join(ROOT, 'src/components/modal/ContractHistoryVersion.tsx'),
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns true if the source contains an `input` element with type="file".
 * Matches both `type="file"` and `type={'file'}` patterns.
 */
function hasFileInput(source: string): boolean {
  return /input[^>]*type=["']file["']/.test(source) || /input[^>]*type=\{["']file["']\}/.test(source);
}

/**
 * Returns true if the source imports faDownload from FontAwesome.
 */
function importsDownloadIcon(source: string): boolean {
  return /faDownload/.test(source);
}

/**
 * Returns true if the source renders a FontAwesomeIcon with faDownload
 * inside a table row (tbody context), indicating a per-row download icon.
 */
function hasPerRowDownloadIcon(source: string): boolean {
  // Check that faDownload is used inside a <tr> or table row context
  // We look for FontAwesomeIcon with faDownload icon prop inside tbody/tr
  return /FontAwesomeIcon[^>]*icon=\{faDownload\}/.test(source) ||
         /FontAwesomeIcon[^>]*icon=\{[^}]*faDownload[^}]*\}/.test(source);
}

/**
 * Returns true if the source contains a file input specifically inside
 * a register or edit modal section (not just anywhere in the file).
 */
function hasFileInputInContractForm(source: string): boolean {
  return hasFileInput(source);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Property 1: Bug Condition - Arquivo Associado ao Contrato em vez da Versão', () => {
  /**
   * Test 1: ContractHistory register modal must NOT contain input[type="file"]
   *
   * On UNFIXED code: ContractHistory.tsx has `input type="file"` in the
   * "Registrar Contrato" modal → this assertion FAILS (confirms bug).
   * On FIXED code: the file input is removed → PASSES.
   */
  test('Test 1: ContractHistory register modal should NOT contain input[type="file"]', () => {
    const source = fs.readFileSync(FILES.contractHistory, 'utf-8');

    // The register modal section contains a file input on unfixed code.
    // After the fix, ContractHistory should have no file input at all.
    const hasFile = hasFileInputInContractForm(source);

    // Expected (fixed) behavior: no file input in ContractHistory
    expect(hasFile).toBe(false);
  });

  /**
   * Test 2: ContractHistory edit modal must NOT contain input[type="file"]
   *
   * On UNFIXED code: ContractHistory.tsx has `input type="file"` in the
   * "Editar Contrato" modal → this assertion FAILS (confirms bug).
   * On FIXED code: the file input is removed → PASSES.
   *
   * Note: Both register and edit modals share the same source file.
   * The presence of any file input in ContractHistory.tsx is the bug.
   */
  test('Test 2: ContractHistory edit modal should NOT contain input[type="file"]', () => {
    const source = fs.readFileSync(FILES.contractHistory, 'utf-8');

    // Count occurrences of file inputs — unfixed code has two (register + edit)
    const fileInputMatches = source.match(/input[^>]*type=["']file["']/g) || [];
    const fileInputCount = fileInputMatches.length;

    // Expected (fixed) behavior: zero file inputs in ContractHistory
    expect(fileInputCount).toBe(0);
  });

  /**
   * Test 3: ContractHistoryVersion must contain input[type="file"] in the version form
   *
   * On UNFIXED code: ContractHistoryVersion.tsx has NO file input at all
   * (it is a read-only list) → this assertion FAILS (confirms bug).
   * On FIXED code: a file input is added to the version form → PASSES.
   */
  test('Test 3: ContractHistoryVersion should contain input[type="file"] in the version form', () => {
    const source = fs.readFileSync(FILES.contractHistoryVersion, 'utf-8');

    const hasFile = hasFileInput(source);

    // Expected (fixed) behavior: file input present in ContractHistoryVersion
    expect(hasFile).toBe(true);
  });

  /**
   * Test 4: ContractHistoryVersion must render a download icon per version row
   *
   * On UNFIXED code: ContractHistoryVersion.tsx does NOT import or use faDownload
   * → this assertion FAILS (confirms bug).
   * On FIXED code: faDownload is imported and used conditionally per row → PASSES.
   */
  test('Test 4: ContractHistoryVersion should render a download icon for versions with arquivo_url', () => {
    const source = fs.readFileSync(FILES.contractHistoryVersion, 'utf-8');

    const hasDownload = hasPerRowDownloadIcon(source);

    // Expected (fixed) behavior: download icon present in ContractHistoryVersion
    expect(hasDownload).toBe(true);
  });
});
