# Security Risk Register

Updated: 2026-05-30

| ID | Severity | Area | Risk | Mitigation in this task | Status |
| --- | --- | --- | --- | --- | --- |
| SEC-P0-API-001 | P0 | Appointment API | Unauthenticated clients could create, update, or delete appointments. | Protected appointment create/update/delete routes with server-side `requireAdmin`. | Mitigated; pending deployed smoke verification |
| SEC-P0-API-002 | P0 | Financial API | Unauthenticated clients could create, update, or delete financial events. | Protected financial event create/update/delete routes with server-side `requireAdmin`. | Mitigated; pending deployed smoke verification |
| SEC-P0-API-003 | P0 | Notifications API | Unauthenticated clients could mutate notification read state or delete notifications. | Protected notification read-state and delete mutation routes with server-side `requireAdmin`. | Mitigated; pending deployed smoke verification |
| SEC-P0-AUTH-004 | P0 | Admin auth | Demo admin fallback could be mistaken for production admin authorization when Supabase was not configured. | Demo admin sign-in/session restore is development-only; Supabase admin role checks trust `app_metadata`, not user-editable `user_metadata`. | Mitigated; pending frontend production auth smoke verification |

## Remaining Risks / Gaps

- No full production deployment smoke test was run in this task.
- RLS policies and Supabase production configuration still need environment-backed verification.
- Public read exposure for appointments, financial events, and notifications should be reviewed as a separate data-classification task.
