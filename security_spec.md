# Security Specification for "Today's Me Character"

## Data Invariants
1. A user can only manage their own profile.
2. A daily status must belong to the authenticated user who created it (`userId == request.auth.uid`).
3. Users can only update their own status.
4. Users can read statuses of other users if they are connected (for now, let's keep reads open for the "Friend Room" concept, but strictly restrict writes).
5. Reactions can only be added once per user per status (ideally), but simplified: anybody signed in can add a reaction.
6. IDs must be valid.

## The "Dirty Dozen" Payloads (Attack Vectors)
1. **Identity Spoofing**: Attempt to create a status with `userId` of another user.
2. **Resource Poisoning**: Large strings in `description` or `oneLiner`.
3. **Privilege Escalation**: Attempt to update another user's profile.
4. **State Shortcutting**: Skipping validation on `energyPercent` (needs to be 0-100).
5. **Orphaned Write**: Creating a status for a non-existent user.
6. **Shadow Update**: Injecting `isAdmin: true` into `UserProfile`.
7. **Temporal Fraud**: Setting `updatedAt` to a future date instead of `request.time`.
8. **Spam Reactions**: Flooding a status with thousands of reactions from one user.
9. **PII Leak**: Reading private emails of other users (UserProfiles should be carefully scoped).
10. **ID Injection**: Using a 1MB string as a Status ID.
11. **Type Mismatch**: Sending a string for `sleepHours`.
12. **Status Hijacking**: Updating a status that belongs to someone else.

## The Test Runner
(I'll focus on the rules drafting next as I can't run a full test suite here, but I will simulate the logic in the rules).
