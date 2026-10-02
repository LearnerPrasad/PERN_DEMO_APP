# User CRUD Design Notes

## Single source of truth
**Problem:** Split list state caused stale UI after edits.
**Solution:** `App` owns the list; children receive props and report changes through callbacks.

## Atomic delete (TOCTOU)
**Problem:** A separate existence check and delete could report false success under concurrent requests.
**Solution:** Use one `DELETE ... RETURNING` query and check the affected-row count.

## Input and uniqueness validation
**Problem:** Invalid IDs could reach the update, and an edit could be rejected for keeping its own email.
**Solution:** Validate the ID and exclude the current user's ID from the duplicate-email check; retain the database unique constraint.

## Centralized loading state
**Problem:** Users had no indication that requests were still running and could submit repeated actions.
**Solution:** `App` owns loading state and passes it to children to show “Loading...” and disable controls.

## Centralized error handling
**Problem:** Request failures were only logged or replaced by generic messages.
**Solution:** `App` owns the shared error state. Children report failures through callbacks, and request handlers display server response messages when available.

## Accessible form labels
**Problem:** Labels need to identify their inputs.
**Solution:** Match each label's `htmlFor` with its input's `id`.

## Commit reference
**Subject:** Centralize user state and improve CRUD feedback
**Scope:** Shared list ownership, atomic deletion, ID/email validation, loading/error feedback, and accessible labels.

## Follow-ups
- Use the trimmed email value in the UPDATE query, matching the value checked for duplicates.
- If the database ID column is PostgreSQL `INTEGER`, also reject IDs above `2,147,483,647`.
- Add tests for CRUD success and failure cases.