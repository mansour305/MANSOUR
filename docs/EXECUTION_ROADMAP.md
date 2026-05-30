# Execution Roadmap

## Phase 0. Full Audit

Map the actual repository structure, application surfaces, data flows, auth/admin model, Supabase/RLS posture, API behavior, frontend state, deployment setup, and current risks. Populate `docs/OPEN_ISSUES_LEDGER.md` with evidence-backed findings.

## Phase 1. Security/Auth/Admin

Verify authentication, authorization, admin-only access, session handling, password reset paths, privileged API routes, and frontend route protection. Fix only evidence-backed security issues.

## Phase 2. Supabase/RLS

Review Supabase tables, policies, service-role usage, user ownership, admin access, and production safety. Confirm that frontend code cannot bypass data access rules.

## Phase 3. Data Source of Truth

Identify production, seed, mock, local, and generated data sources. Remove ambiguity and ensure user-facing flows use the intended source of truth.

## Phase 4. API Reliability

Review backend validation, error handling, auth enforcement, route coverage, response consistency, logging, and integration behavior.

## Phase 5. Frontend UX

Review primary user and admin flows on RTL and mobile. Fix layout, navigation, form, empty-state, loading, and error-state issues with focused verification.

## Phase 6. Visual Reference Clone

Compare the app against the approved visual reference. Implement visual alignment only after functional and security issues are understood.

## Phase 7. QA

Run the planned command, manual, security, data, visual, and deployment smoke checks. Record results and unresolved gaps.

## Phase 8. Deployment

Verify environment variables, hosting configuration, production build behavior, backend/API deployment, Supabase connectivity, and rollback considerations.

## Phase 9. Final Handover

Produce a concise evidence-backed handover with completed work, remaining issues, verification results, deployment notes, and final readiness verdict.
