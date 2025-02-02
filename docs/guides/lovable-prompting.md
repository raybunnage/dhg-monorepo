# Lovable Prompting Handbook

A comprehensive guide to mastering changes, commits, and error debugging with Lovable.

## Table of Contents
- [Enhance Prompt](#enhance-prompt)
- [Starting a New Project](#starting-a-new-project)
- [Diff & Select](#diff--select)
- [Lock Files](#lock-files)
- [Design](#design)
- [Knowledge Base](#knowledge-base)
- [Mobile First](#mobile-first)
- [Details](#details)
- [Step by Step](#step-by-step)
- [Chat Mode](#chat-mode)
- [Errors](#errors)
- [Don't Lose Components](#dont-lose-components)
- [Refactoring](#refactoring)
- [Stripe](#stripe)
- [Ask for Help](#ask-for-help)
- [Last Thoughts](#last-thoughts)

## Enhance Prompt

The quality of your prompts significantly influences the AI's output. A comprehensive and well-organized prompt saves credits and time by reducing errors.

Best practices:
- Provide detailed context in the input field
- Use "Select" for precise component editing
- Leverage experimental "Chat mode"

## Starting a New Project

Use this structure:
```
I need a [type] application with:
- Tech stack (Frontend, styling, Authorization, Database)
- Core features (main and secondary)
- Start with: [Detailed page requirements]
```

**Recommendation**: Begin with a blank project and build gradually.

## Diff & Select

When requesting changes:
- Provide clear file instructions
- Edit only necessary sections
- Minimize changes to few lines
- Reduce loading times
- Prevent error loops

Example prompt:
```
Implement modifications while ensuring:
- Core functionality remains intact
- Other features unaffected
- Dependencies evaluated
- Risks identified
- Testing completed
```

## Lock Files

While Lovable lacks built-in file locking:

```
Please refrain from altering pages X or Y and focus changes solely on page Z.
```

For sensitive updates:
```
This update requires precision:
- Examine dependencies
- Assess potential impacts
- Test systematically
- Seek clarification if unsure
```

## Design

### UI Changes
```
Make visual enhancements while:
- Preserving functionality and logic
- Understanding UI interactions
- Maintaining state management
- Testing thoroughly
```

### Optimize for Mobile
```
Enhance mobile experience:
- Preserve existing design
- Assess layout and responsiveness
- Plan before changes
- Test across devices
```

### Responsiveness and Breakpoints
```
Ensure responsive design:
- Mobile-first approach
- Use ShadCN/Tailwind breakpoints
- Avoid custom breakpoints
- Test all screen sizes
```

## Knowledge Base

Essential project context components:

### Project Requirements Document (PRD)
- Introduction
- App flow
- Core features
- Tech stack
- Scope definition

### Application Flow
Example:
```
Users start on landing page → click sign-up → register with Google → access dashboard
Dashboard sections: X, Y, Z
```

### Tech Stack Details
- Frontend Tech Stack
- Backend Tech Stack
- API Integrations
- Deployment Instructions
- Open-source libraries

### Frontend Guidelines
- Design Principles
- Styling Guidelines
- Page Layout
- Navigation Structure
- Color Palettes
- Typography

### Backend Structure
- Supabase configuration
- User Authentication
- Database Architecture
- Storage buckets
- API Endpoints
- Security measures
- Hosting Solutions

## Mobile First

Best practices:
- Prioritize mobile design
- Use built-in breakpoints
- Focus on touch interactions
- Test across devices

Example prompt:
```
Optimize for mobile:
- Responsive on all breakpoints
- Mobile-first approach
- Use standard breakpoints
- Preserve functionality
```

## Details

Instead of:
```
"Move the button to the right"
```

Use:
```
"In the top header, shift the sign-up button to the left side, maintaining consistent styling"
```

Key Guidelines:
```
- Approach problems systematically
- Break down complex tasks
- Explain reasoning
- Highlight challenges
- Suggest improvements
```

## Step by Step

Follow this sequence:
1. Front design (page by page)
2. Backend integration (Supabase)
3. UX/UI refinement

## Chat Mode

Effective usage patterns:

### Review Mode
```
Chat only mode - Review the app and identify outdated code
```

### Implementation Mode
```
Default mode - Execute the plan and implement changes
```

### Analysis Prompts
```
Perform comprehensive regression:
- Evaluate architecture
- Check modularity
- Assess organization
- Review separation of concerns
```

## Errors

Error handling approach:
1. Try "Try to fix" up to 3 times
2. Use "Chat mode" for analysis
3. Apply chain-of-thought reasoning
4. Make corrections in "Edit mode"

Example prompts:

### Initial Investigation
```
Investigate root cause:
- Examine logs
- Check workflows
- Review dependencies
- Suggest initial solution
```

### Deep Analysis
```
Perform thorough analysis:
- Stop modifications
- Record failures
- Document patterns
- Avoid speculation
```

## Don't Lose Components

Maintenance practices:
- Implement after significant changes
- Review after minor adjustments
- Reference filesExplainer.md
- Keep file structure organized
- Document changes regularly

## Refactoring

### Planning Phase
```
Develop refactoring plan:
- Document existing functionality
- Identify enhancement areas
- Establish testing protocols
- Implement gradually
```

### Post-Refactor Review
```
Verify changes:
- Check UI integrity
- Test functionality
- Review specifications
- Document updates
```

## Stripe

Integration template:
```
Initialize Stripe in test mode:
- Product IDs: [Your Product IDs]
- Pricing: [One-time/Subscription]
- Webhook: [Your Webhook Endpoint]
- Success URL: [Success Redirect URL]
- Cancel URL: [Cancel Redirect URL]
```

**Security Note**: Never include Stripe Secret Key or Webhook Signing Secret in prompts.

## Ask for Help

Alternative approaches:
- Make minor changes directly
- Use browser's Inspect tool
- Test changes in browser
- Implement verified changes
- Save Lovable prompts for complex tasks

## Last Thoughts

Focus areas:
- Business idea development
- Market validation
- Investment securing
- Gradual improvement

Remember: Whether you're an experienced developer or new to coding, Lovable adapts to your needs and supports your journey.

---

*This guide is maintained and updated regularly to reflect best practices and new features.* 