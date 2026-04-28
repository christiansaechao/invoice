/**
 * Invoice Status Transition Map
 *
 * Duplicated from the backend (`invoice-backend/src/lib/invoice-status.ts`).
 * Kept in sync manually — both must define the same transition rules.
 */

import type { InvoiceStatus, NudgeType } from "@/types/invoice.types";

export const STATUS_TRANSITIONS: Record<InvoiceStatus, InvoiceStatus[]> = {
  draft:   ["pending", "void"],
  pending: ["paid", "void"],
  overdue: ["paid", "void"],
  paid:    ["void"],
  void:    [],
};

/** User-friendly labels shown in the dropdown for transition targets. */
export const TRANSITION_LABELS: Partial<Record<InvoiceStatus, string>> = {
  pending: "Send Invoice",
  paid:    "Mark as Paid",
  void:    "Void Invoice",
};

/**
 * Nudge Milestones (relative to due date)
 * Synchronized with backend scheduling logic.
 */
export const NUDGE_MILESTONES = [-3, 0, 3, 7];

/**
 * Mapping of day-offset to Database Nudge Type
 */
export const MILESTONE_MAP: Record<number, NudgeType> = {
  [-3]: "initial",
  [0]: "reminder_1",
  [3]: "reminder_2",
  [7]: "final_notice"
};
