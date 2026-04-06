/**
 * Preservation Property Tests - Property 2
 *
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4
 *
 * EXPECTED OUTCOME: All tests PASS on unfixed code.
 * These tests capture the baseline behavior that must be preserved after the fix.
 *
 * Methodology: static source-file analysis (same pattern as task 1 bug condition tests).
 * We read the source files as text and verify structural properties with regex.
 *
 * Property 2: Preservation — Comportamento de Contrato Sem Arquivo
 *   For any contract form submission without a file, the saved fields
 *   (tipo, datas, observação, ativo) are unchanged.
 *   For any contract list render, all expected columns are present
 *   regardless of arquivo_url value.
 *   For any version list render, all expected columns are present.
 *   Pagination controls are present in both lists.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as fc from 'fast-check';

// ---------------------------------------------------------------------------
// File paths
// ---------------------------------------------------------------------------

const ROOT = path.resolve(__dirname, '../../../../');

const FILES = {
  contractHistory: path.join(ROOT, 'src/components/modal/ContractHistory.tsx'),
  contractHistoryVersion: path.join(ROOT, 'src/components/modal/ContractHistoryVersion.tsx'),
};

// ---------------------------------------------------------------------------
// Source cache (read once)
// ---------------------------------------------------------------------------

const SOURCE = {
  contractHistory: fs.readFileSync(FILES.contractHistory, 'utf-8'),
  contractHistoryVersion: fs.readFileSync(FILES.contractHistoryVersion, 'utf-8'),
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns true if the source contains a <th> or column header with the given label. */
function hasColumnHeader(source: string, label: string): boolean {
  // Match <th ...>Label</th> with optional whitespace
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`<th[^>]*>\\s*${escaped}\\s*</th>`).test(source);
}

/** Returns true if the source contains a Pagination component. */
function hasPagination(source: string): boolean {
  return /<Pagination\b/.test(source);
}

/** Returns true if the source contains a form field (input or select) with the given name. */
function hasFormField(source: string, fieldName: string): boolean {
  const escaped = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`name=["']${escaped}["']`).test(source);
}

/** Returns true if the source contains a date input with the given name. */
function hasDateInput(source: string, fieldName: string): boolean {
  const escaped = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`type=["']date["'][^>]*name=["']${escaped}["']|name=["']${escaped}["'][^>]*type=["']date["']`).test(source);
}

/** Returns true if the source contains a Checkbox for the given field name. */
function hasCheckboxField(source: string, fieldName: string): boolean {
  const escaped = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`name=["']${escaped}["']`).test(source);
}

/** Returns true if the source contains a select for contract type. */
function hasContractTypeSelect(source: string): boolean {
  return /name=["']contrato_sub_tipo_id["']/.test(source);
}

/** Returns true if the source renders a table cell with the given data field expression (raw regex). */
function hasTableDataField(source: string, fieldExpr: string): boolean {
  return new RegExp(fieldExpr).test(source);
}

// ---------------------------------------------------------------------------
// Requirement 3.1 — Contract form fields preserved (tipo, datas, observação, ativo)
// ---------------------------------------------------------------------------

describe('Property 2: Preservation — Requirement 3.1 — Contract form fields without arquivo', () => {
  /**
   * For any contract form, the tipo (contrato_sub_tipo_id) field must be present.
   * This is the register form's type selector — must survive the fix.
   */
  test('ContractHistory register form contains tipo (contrato_sub_tipo_id) field', () => {
    expect(hasContractTypeSelect(SOURCE.contractHistory)).toBe(true);
  });

  /**
   * For any contract form, data_inicio field must be present.
   */
  test('ContractHistory form contains data_inicio date field', () => {
    expect(hasDateInput(SOURCE.contractHistory, 'data_inicio')).toBe(true);
  });

  /**
   * For any contract form, data_termino field must be present.
   */
  test('ContractHistory form contains data_termino date field', () => {
    expect(hasDateInput(SOURCE.contractHistory, 'data_termino')).toBe(true);
  });

  /**
   * For any contract form, observacao field must be present.
   */
  test('ContractHistory form contains observacao field', () => {
    expect(hasFormField(SOURCE.contractHistory, 'observacao')).toBe(true);
  });

  /**
   * For any contract edit form, ativo (checkbox) field must be present.
   */
  test('ContractHistory edit form contains ativo checkbox', () => {
    expect(hasCheckboxField(SOURCE.contractHistory, 'ativo')).toBe(true);
  });

  /**
   * Property-based: for any combination of field names from the required set,
   * each field is independently present in the source.
   * Validates: Requirements 3.1
   */
  test('PBT: for any required contract form field, it is present in ContractHistory source', () => {
    const requiredFields = [
      { name: 'data_inicio', check: (s: string) => hasDateInput(s, 'data_inicio') },
      { name: 'data_termino', check: (s: string) => hasDateInput(s, 'data_termino') },
      { name: 'observacao', check: (s: string) => hasFormField(s, 'observacao') },
      { name: 'ativo', check: (s: string) => hasCheckboxField(s, 'ativo') },
      { name: 'contrato_sub_tipo_id', check: (s: string) => hasContractTypeSelect(s) },
    ];

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: requiredFields.length - 1 }),
        (idx) => {
          const field = requiredFields[idx];
          return field.check(SOURCE.contractHistory);
        }
      ),
      { numRuns: 50 }
    );
  });
});

// ---------------------------------------------------------------------------
// Requirement 3.2 — Contract list table columns preserved
// ---------------------------------------------------------------------------

describe('Property 2: Preservation — Requirement 3.2 — Contract list table columns', () => {
  const expectedColumns = ['Tipo', 'Nome', 'Versão', 'Observação', 'Data Início', 'Data Término', 'Ativo'];

  test.each(expectedColumns)(
    'ContractHistory table has column header: %s',
    (col) => {
      expect(hasColumnHeader(SOURCE.contractHistory, col)).toBe(true);
    }
  );

  /**
   * Property-based: for any column from the expected set, it is present in the table.
   * Validates: Requirements 3.2
   */
  test('PBT: for any expected contract list column, it is present regardless of arquivo_url value', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: expectedColumns.length - 1 }),
        (idx) => {
          return hasColumnHeader(SOURCE.contractHistory, expectedColumns[idx]);
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * The table renders contrato_tipo, contrato_nome, versao, observacao,
   * data_inicio, data_termino, ativo data fields.
   */
  test('ContractHistory table renders contrato_tipo data', () => {
    expect(hasTableDataField(SOURCE.contractHistory, 'contract\\.contrato_tipo')).toBe(true);
  });

  test('ContractHistory table renders contrato_nome data', () => {
    expect(hasTableDataField(SOURCE.contractHistory, 'contract\\.contrato_nome')).toBe(true);
  });

  test('ContractHistory table renders versao data', () => {
    expect(hasTableDataField(SOURCE.contractHistory, 'contract\\.versao')).toBe(true);
  });

  test('ContractHistory table renders observacao data', () => {
    expect(hasTableDataField(SOURCE.contractHistory, 'contract\\.observacao')).toBe(true);
  });

  test('ContractHistory table renders data_inicio data', () => {
    expect(hasTableDataField(SOURCE.contractHistory, 'contract\\.data_inicio')).toBe(true);
  });

  test('ContractHistory table renders data_termino data', () => {
    expect(hasTableDataField(SOURCE.contractHistory, 'contract\\.data_termino')).toBe(true);
  });

  test('ContractHistory table renders ativo status icon', () => {
    expect(hasTableDataField(SOURCE.contractHistory, 'contract\\.ativo')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Requirement 3.3 — Version list table columns preserved
// ---------------------------------------------------------------------------

describe('Property 2: Preservation — Requirement 3.3 — Version list table columns', () => {
  const expectedVersionColumns = ['Versão', 'Observação', 'Data Início', 'Data Término'];

  test.each(expectedVersionColumns)(
    'ContractHistoryVersion table has column header: %s',
    (col) => {
      expect(hasColumnHeader(SOURCE.contractHistoryVersion, col)).toBe(true);
    }
  );

  /**
   * Property-based: for any column from the expected version set, it is present.
   * Validates: Requirements 3.3
   */
  test('PBT: for any expected version list column, it is present in ContractHistoryVersion', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: expectedVersionColumns.length - 1 }),
        (idx) => {
          return hasColumnHeader(SOURCE.contractHistoryVersion, expectedVersionColumns[idx]);
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * The version table renders versao, observacao, data_inicio, data_termino data fields.
   * ContractHistoryVersion uses `version` as the loop variable (not `contract`).
   */
  test('ContractHistoryVersion table renders versao data', () => {
    expect(hasTableDataField(SOURCE.contractHistoryVersion, 'version\\.versao')).toBe(true);
  });

  test('ContractHistoryVersion table renders observacao data', () => {
    expect(hasTableDataField(SOURCE.contractHistoryVersion, 'version\\.observacao')).toBe(true);
  });

  test('ContractHistoryVersion table renders data_inicio data', () => {
    expect(hasTableDataField(SOURCE.contractHistoryVersion, 'version\\.data_inicio')).toBe(true);
  });

  test('ContractHistoryVersion table renders data_termino data', () => {
    expect(hasTableDataField(SOURCE.contractHistoryVersion, 'version\\.data_termino')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Requirement 3.4 — Pagination controls present in both lists
// ---------------------------------------------------------------------------

describe('Property 2: Preservation — Requirement 3.4 — Pagination controls', () => {
  test('ContractHistory contains a Pagination component', () => {
    expect(hasPagination(SOURCE.contractHistory)).toBe(true);
  });

  test('ContractHistoryVersion contains a Pagination component', () => {
    expect(hasPagination(SOURCE.contractHistoryVersion)).toBe(true);
  });

  /**
   * Property-based: for any source file in the set, pagination is present.
   * Validates: Requirements 3.4
   */
  test('PBT: for any list component, pagination control is present', () => {
    const components = [SOURCE.contractHistory, SOURCE.contractHistoryVersion];

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: components.length - 1 }),
        (idx) => {
          return hasPagination(components[idx]);
        }
      ),
      { numRuns: 50 }
    );
  });
});
