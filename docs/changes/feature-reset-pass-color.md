# Auth Service Change Guidelines

## Critical Rules for Auth Changes 🚨

1. **Preserve Existing Functionality**
   - Never modify working auth flows without thorough testing
   - Be careful when making tests NOT to change the code but make the test conforms unless you tell me why the code is broken and you want to fix it.
   - Always test existing flows before and after changes
   - Keep original code paths intact when adding new features

2. **Incremental Changes Only**
   - Make one logical change at a time
   - Test each change before proceeding
   - Document each step and its impact

3. **Change Documentation Template**
   ```markdown
   ## Change Record: [DATE]
   
   ### Proposed Change
   - Description of change
   - Purpose/goal
   - Expected impact
   
   ### Testing Steps
   1. Test existing functionality first
   2. Document current behavior
   3. Apply change
   4. Test modified behavior
   5. Verify no regression
   
   ### Rollback Plan
   - Specific steps to revert if needed
   - Verification steps after rollback
   
   ### Change Status
   - [ ] Tested existing flows
   - [ ] Applied change
   - [ ] Verified no regression
   - [ ] Documented in code
   - [ ] Updated tests
   ```

4. **Regression Prevention**
   - Password Reset Flow
     - Must maintain email sending
     - Must preserve token handling
     - Must keep security measures
   - Login Flow
     - Must maintain session handling
     - Must preserve error messages
   - Signup Flow
     - Must maintain verification
     - Must preserve user creation

5. **Testing Requirements**
   - Test all auth flows before changes
   - Document current behavior
   - Test same flows after changes
   - Verify error handling
   - Check security implications

6. **Rollback Protocol**
   - Keep original code in comments for 24h
   - Document exact changes made
   - Have clear reversion steps
   - Test rollback procedure

## Change Log Structure

Each change should be documented in a separate file:
```
docs/auth/changes/
  └── YYYY-MM-DD-description/
      ├── change.md      # Detailed change description
      ├── tests.md       # Test cases and results
      └── rollback.md    # Rollback procedure
```

## Review Checklist

Before submitting changes:
- [ ] All existing auth flows still work
- [ ] No security vulnerabilities introduced
- [ ] Changes are properly documented
- [ ] Rollback plan is in place
- [ ] Tests are updated
- [ ] Error handling is maintained 