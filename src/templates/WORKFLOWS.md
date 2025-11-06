# AgentWeaver Workflow Orchestration Guide

**Version**: 1.0
**Last Updated**: 2025-01-04

This document defines comprehensive workflows for agent collaboration across all common software development, marketing, and sales scenarios. Claude Code will automatically detect your situation and suggest the appropriate workflow.

---

## 🎯 Workflow Overview

AgentWeaver provides **9 major workflows** covering the complete software development lifecycle and go-to-market activities:

| Workflow | When to Use | Key Agents | Duration |
|----------|-------------|------------|----------|
| 🆕 **Greenfield App** | Building app from scratch | All dev + marketing/sales | Weeks-Months |
| ✨ **Feature Development** | Adding new features | product-owner → tech-lead → dev → qa | Days-Weeks |
| 🐛 **Bug Resolution** | Fixing bugs and errors | debugger → tech-lead → dev → qa | Hours-Days |
| 🎨 **UI/UX Design** | Component generation | product-owner → ui-ux-dev → tech-lead → frontend-dev | Days |
| 🚀 **Infrastructure/DevOps** | CI/CD, deployment, scaling | devops → tech-lead → qa | Days-Weeks |
| 📣 **Marketing Campaign** | Product launch and promotion | marketing team | Weeks |
| 💰 **Sales Process** | Selling and customer success | sales team | Ongoing |
| 🏗️ **Architecture Review** | Refactoring and optimization | tech-lead → dev → qa | Weeks |
| 📚 **Documentation** | Creating/updating docs | docs-writer → tech-lead | Days |

---

## 🔄 Workflow Execution Mode

**Semi-Automatic (Recommended)**:
- Claude Code detects your scenario based on keywords and context
- Suggests appropriate workflow: "I see you're starting a greenfield app. I'll follow the Greenfield Workflow..."
- You can approve, modify, or skip the workflow
- Workflows are composable - can transition between workflows as needed

---

## WORKFLOW #1: 🆕 Greenfield Application (0 → Production)

**Trigger Keywords**: "build app from scratch", "new project", "start application", "greenfield", "MVP", "prototype"

**Use When**:
- No existing codebase
- Starting a completely new application
- Building MVP or prototype
- Need full lifecycle from requirements to deployment

### Phase 1: Discovery & Planning

#### Step 1: @product-owner - Requirements Gathering
**Duration**: 2-5 days

**Actions**:
1. Interview stakeholders and define business objectives
2. Identify target users and create personas
3. Define core features and MVP scope
4. Write user stories with acceptance criteria
5. Prioritize features (MoSCoW method)
6. Document assumptions and constraints

**Deliverable**: Product Requirements Document (PRD)

**Handoff**: Share PRD with @scrum-master and @tech-lead

---

#### Step 2: @scrum-master - Sprint Planning Setup
**Duration**: 1-2 days

**Actions**:
1. Review PRD with @product-owner
2. Break user stories into actionable tasks
3. Estimate effort (story points or t-shirt sizes)
4. Create initial sprint backlog (2-week sprints)
5. Set up project tracking (GitHub Projects, Jira, Linear)
6. Schedule team ceremonies (standups, retrospectives)

**Deliverable**: Sprint plan with prioritized backlog

**Handoff**: Kick off sprint with development team

---

#### Step 3: @tech-lead - Architecture & Tech Stack Selection
**Duration**: 3-5 days

**CRITICAL**: This step defines the technology foundation. Tech-lead will:

**Actions**:
1. Review PRD and understand technical requirements
2. Research architecture patterns using **WebSearch MCP**:
   - "Best architecture for [type] application 2025"
   - "Scalability patterns for [traffic level]"
   - "[Framework] vs [Framework] comparison 2025"
3. Select tech stack based on:
   - Team expertise
   - Scalability requirements
   - Development speed vs performance trade-offs
   - Community support and ecosystem
4. Check dependency security with **Socket MCP**
5. Design system architecture (diagrams)
6. Create Architecture Decision Records (ADRs)
7. **UPDATE `.claude/agentweaver.config.yml`** with chosen stack:
   ```yaml
   techStack:
     frontend:
       framework: "React"
       version: "18.x"
       language: "TypeScript"
     backend:
       framework: "Express.js"
       version: "4.x"
       language: "TypeScript"
     database:
       primary: "PostgreSQL"
       version: "15.x"
     testing:
       unit: "Jest"
       e2e: "Playwright"
   ```

**Deliverable**:
- Architecture diagrams
- ADRs
- **Updated agentweaver.config.yml**
- Tech stack justification

**User Review Required**:
- Review and approve tech stack choices
- Verify agentweaver.config.yml updates

**Handoff**: @tech-lead will delegate work to development team (@backend-dev, @frontend-dev) after @devops sets up environment

---

### Phase 2: Development Setup & Implementation

#### Step 4: @devops - Infrastructure & Environment Setup
**Duration**: 2-3 days

**Actions**:
1. Read **agentweaver.config.yml** to understand tech stack
2. Create Git repository structure:
   ```
   /
   ├── backend/
   ├── frontend/
   ├── docs/
   ├── .github/workflows/
   └── docker/
   ```
3. Set up development environment:
   - Docker Compose for local development
   - Environment variable templates (.env.example)
   - Database initialization scripts
4. Create base project scaffolding
5. Configure local development workflow
6. Document setup instructions in README

**Deliverable**:
- Repository structure
- Docker setup
- .env.example
- Setup documentation

**Handoff**: @tech-lead receives environment setup completion and delegates backend work to @backend-dev

---

#### Step 5: @tech-lead - Work Delegation & Backend Kickoff
**Duration**: 0.5 day

**Actions**:
1. Review completed environment setup from @devops
2. Review sprint backlog from @scrum-master
3. Assign backend tasks to @backend-dev based on:
   - API endpoints needed
   - Database schema design
   - Authentication/authorization requirements
4. Clarify technical requirements and acceptance criteria
5. Provide architectural guidance and constraints
6. Set up code review expectations

**Deliverable**: Clear task assignments with technical specifications

**Handoff**: @backend-dev begins implementation under @tech-lead oversight

---

#### Step 6: @backend-dev - Backend Implementation
**Duration**: 2-4 weeks (Sprint 1-2)

**Parallel Track**: Can work simultaneously with @frontend-dev

**Actions**:
1. Read **agentweaver.config.yml** for backend tech stack
2. Set up backend project structure following chosen framework
3. Implement database schema and migrations
4. Create data models and repositories
5. Implement REST API or GraphQL endpoints
6. Add authentication/authorization (JWT, OAuth, etc.)
7. Implement business logic and validations
8. Add comprehensive error handling and logging
9. Use **Socket MCP** to scan dependencies before installation
10. Write unit tests (≥80% coverage)
11. Write integration tests for API endpoints
12. Generate API documentation (Swagger/OpenAPI)
13. Test with Postman/curl

**Deliverable**:
- Working backend API
- Database schema
- API documentation
- Unit and integration tests
- Test coverage report

**Handoff**: Report API completion to @tech-lead, who coordinates with @frontend-dev for integration

---

#### Step 7: @frontend-dev - Frontend Implementation
**Duration**: 2-4 weeks (Sprint 1-2)

**Parallel Track**: Can work simultaneously with @backend-dev

**Actions**:
1. Read **agentweaver.config.yml** for frontend tech stack
2. Set up frontend project structure
3. Configure routing and navigation
4. Create component library (using shadcn/ui if configured)
5. Implement state management (Redux, Zustand, etc.)
6. Integrate with backend API
7. Implement authentication UI and flows
8. Add form validation (Zod, Yup, etc.)
9. Implement responsive design (mobile-first)
10. Add accessibility features (WCAG AA):
    - Keyboard navigation
    - ARIA labels
    - Screen reader support
11. Use **Socket MCP** to scan dependencies
12. Write component tests and integration tests
13. Test on multiple browsers and devices

**Deliverable**:
- Working frontend application
- Component library
- Component tests
- Accessibility compliance report
- Cross-browser compatibility verification

**Handoff**: Report frontend completion to @tech-lead for code review before QA handoff

---

#### Step 8: @tech-lead - Code Review & QA Approval
**Duration**: 1-2 days

**Actions**:
1. Review backend code from @backend-dev:
   - Code quality and conventions
   - Security vulnerabilities
   - Performance considerations
   - Test coverage
2. Review frontend code from @frontend-dev:
   - Component architecture
   - State management
   - Accessibility
   - Performance
3. Provide feedback and request changes if needed
4. Approve code for QA testing
5. Brief @qa-tester on features and test scenarios

**Deliverable**: Code review approval and QA test plan

**Handoff**: @tech-lead approves handoff to @qa-tester for comprehensive testing

---

#### Step 9: @qa-tester - End-to-End Testing & Quality Assurance
**Duration**: 1-2 weeks

**Actions**:
1. Review acceptance criteria from PRD
2. Design test scenarios (happy paths, edge cases, error cases)
3. Write E2E tests using **Playwright MCP**:
   - User registration and login flows
   - Core feature workflows
   - Error handling and validation
   - Cross-browser testing
4. Perform accessibility testing:
   - Keyboard navigation
   - Screen reader compatibility
   - Color contrast
   - WCAG AA compliance
5. Performance testing:
   - Lighthouse audits
   - Load testing (if required)
   - API response time testing
6. Security testing:
   - Authentication/authorization flows
   - Input validation
   - SQL injection prevention
   - XSS prevention
7. Document bugs in issue tracker
8. Verify bug fixes

**Deliverable**:
- E2E test suite
- Test execution report
- Bug reports
- Quality assessment

**Handoff**: Report to @tech-lead for production readiness review

---

### Phase 3: Deployment & Documentation

#### Step 10: @tech-lead - Production Readiness Review
**Duration**: 1 day

**Actions**:
1. Review @qa-tester test results and bug reports
2. Verify all critical and high-priority bugs are resolved
3. Review code quality metrics and test coverage
4. Assess performance benchmarks
5. Review security scan results
6. Approve production deployment or request additional fixes
7. Brief @devops on deployment requirements and monitoring

**Deliverable**: Production readiness approval

**Handoff**: @tech-lead approves deployment, @devops proceeds with CI/CD setup

---

#### Step 11: @devops - CI/CD Pipeline & Deployment
**Duration**: 3-5 days

**Actions**:
1. Set up CI/CD pipeline (GitHub Actions, GitLab CI, CircleCI):
   ```yaml
   Pipeline stages:
   - Lint and format check
   - Unit tests
   - Integration tests
   - E2E tests
   - Build
   - Deploy to staging
   - Smoke tests
   - Deploy to production (manual approval)
   ```
2. Configure environments:
   - **Staging**: Mirror of production for final testing
   - **Production**: Live environment with monitoring
3. Set up secrets management (GitHub Secrets, Vault, AWS Secrets Manager)
4. Configure auto-scaling (if needed)
5. Set up monitoring and alerting:
   - Application performance (DataDog, New Relic)
   - Error tracking (Sentry, Rollbar)
   - Uptime monitoring
   - Log aggregation (ELK, CloudWatch)
6. Perform smoke tests with **Playwright MCP**
7. Create deployment runbook
8. Document rollback procedures

**Deliverable**:
- CI/CD pipeline
- Staging and production environments
- Monitoring dashboards
- Deployment runbook

**Handoff**: Application is live in production

---

#### Step 12: @docs-writer - Documentation
**Duration**: 3-5 days

**Actions**:
1. Create comprehensive README:
   - Project overview
   - Setup instructions
   - Running locally
   - Running tests
   - Deployment process
2. Write API documentation:
   - Endpoint descriptions
   - Request/response examples
   - Authentication details
   - Error codes and handling
3. Create developer onboarding guide
4. Document architecture and design decisions
5. Write troubleshooting guide (common issues)
6. Create user guide (if needed)
7. Document environment variables and configuration

**Deliverable**:
- README.md
- API documentation
- Developer guides
- Troubleshooting documentation

**Handoff**: Share docs with team for review

---

### Phase 4: Go-To-Market & Support

**Timing**: Start after MVP is deployed to production (can start earlier if desired)

#### Step 13: @marketing-manager - Marketing Strategy & Launch Plan
**Duration**: 1-2 weeks

**Actions**:
1. Review product features and value proposition
2. Define target audience and Ideal Customer Profile (ICP)
3. Research competitors using **WebSearch MCP**:
   - Competitor positioning and messaging
   - Market trends and opportunities
   - Pricing strategies
4. Create go-to-market strategy:
   - Positioning and messaging
   - Channel strategy (content, social, paid, SEO)
   - Budget allocation
5. Plan launch campaign across channels
6. Set KPIs and success metrics
7. Create campaign timeline

**Deliverable**: Marketing strategy and launch plan

**Handoff**: Share with content and social media teams

---

#### Step 14: @content-writer - Content Creation
**Duration**: 1-2 weeks

**Actions**:
1. Write product landing page copy
2. Create blog posts announcing launch
3. Write product feature descriptions
4. Create email campaign content
5. Write case studies and testimonials (if available)
6. Create social media copy templates
7. Write press release (if applicable)

**Deliverable**: Marketing content assets

**Handoff**: Share with @seo-specialist and @social-media

---

#### Step 15: @seo-specialist - SEO Optimization
**Duration**: 1-2 weeks

**Actions**:
1. Keyword research using **WebSearch MCP**
2. Optimize website content for target keywords
3. Set up Google Search Console and Analytics
4. Create and submit sitemap
5. Optimize meta tags, descriptions, and headings
6. Build backlink strategy
7. Set up local SEO (if applicable)
8. Monitor search rankings

**Deliverable**: SEO-optimized website

---

#### Step 16: @social-media - Social Media Launch
**Duration**: Ongoing

**Actions**:
1. Create or optimize social media accounts
2. Design social media calendar (first 30 days)
3. Create launch announcement posts
4. Schedule content for first month
5. Set up engagement monitoring
6. Respond to comments and messages
7. Track metrics and adjust strategy

**Deliverable**: Active social media presence

---

#### Step 17: @sales-manager - Sales Process Setup
**Duration**: 1-2 weeks

**Actions**:
1. Define Ideal Customer Profile (ICP)
2. Create sales playbook:
   - Qualification criteria (BANT, MEDDIC)
   - Sales process stages
   - Objection handling
3. Set up CRM (Salesforce, HubSpot, Pipedrive)
4. Create sales collateral:
   - Pitch deck
   - Product demos
   - ROI calculator
   - Case studies
5. Set quotas and territories
6. Train sales team

**Deliverable**: Sales process and team readiness

**Handoff**: Sales team begins prospecting

---

#### Step 18: @customer-success - Customer Support Setup
**Duration**: 1 week

**Actions**:
1. Create customer onboarding process
2. Set up support ticketing system (Zendesk, Intercom)
3. Create knowledge base articles
4. Define success metrics:
   - Customer health score
   - NPS (Net Promoter Score)
   - Churn rate
5. Set up customer health monitoring
6. Create escalation procedures

**Deliverable**: Customer success infrastructure

---

## WORKFLOW #2: ✨ Feature Development

**Trigger Keywords**: "add feature", "implement", "new functionality", "enhancement"

**Use When**:
- Existing codebase
- Adding new features to existing app
- Enhancing current functionality

### Quick Flow

```
@product-owner (feature spec)
    ↓
@tech-lead (technical review & dev assignment)
    ↓
@backend-dev OR @frontend-dev (implementation)
    ↓
@tech-lead (code review)
    ↓
@qa-tester (testing)
    ↓
@devops (deployment - if needed)
    ↓
@docs-writer (documentation update)
```

### Detailed Steps

#### Step 1: @product-owner - Feature Requirements
**Duration**: 1-2 days

**Actions**:
1. Define feature requirements
2. Create user stories with acceptance criteria
3. Prioritize against existing backlog
4. Identify dependencies and risks

**Deliverable**: Feature specification

**Handoff**: Share feature spec with @tech-lead for technical review

---

#### Step 2: @tech-lead - Technical Review & Developer Assignment
**Duration**: 0.5-1 day

**CRITICAL**: Tech-lead acts as gateway between product and dev team

**Actions**:
1. Review feature requirements from @product-owner
2. Assess impact on existing architecture
3. Identify technical challenges and dependencies
4. Design API contracts and data models (if needed)
5. Check if tech stack updates needed in agentweaver.config.yml
6. Determine if feature is backend, frontend, or full-stack
7. Assign to appropriate developer (@backend-dev or @frontend-dev)
8. Brief developer on technical approach and constraints
9. Set code review expectations and quality gates

**Deliverable**: Technical design and developer assignment

**Handoff**: @tech-lead assigns work to @backend-dev or @frontend-dev with clear technical guidance

---

#### Step 3: @backend-dev OR @frontend-dev - Implementation
**Duration**: Variable (days to weeks)

**Actions**:
1. Read **agentweaver.config.yml** for tech stack
2. Implement feature according to spec
3. Follow existing code patterns
4. Write unit tests
5. Write integration tests
6. Scan new dependencies with **Socket MCP**
7. Update API documentation (if backend)

**Deliverable**: Working feature with tests

**Handoff**: Submit feature to @tech-lead for code review

---

#### Step 4: @tech-lead - Code Review & QA Approval
**Duration**: 0.5-1 day

**Actions**:
1. Review code quality and adherence to standards
2. Check for security vulnerabilities
3. Verify test coverage is adequate
4. Assess performance implications
5. Provide feedback and request changes if needed
6. Approve feature for QA testing

**Deliverable**: Code review approval

**Handoff**: @tech-lead approves handoff to @qa-tester

---

#### Step 5: @qa-tester - Feature Testing
**Duration**: 1-3 days

**Actions**:
1. Test feature against acceptance criteria
2. Write E2E tests with **Playwright MCP**
3. Regression testing (ensure no breaks)
4. Accessibility testing (if UI changes)
5. Performance testing (if needed)

**Deliverable**: Test report and E2E tests

---

#### Step 6: @devops - Deployment (if needed)
**Duration**: 0.5-1 day

**Actions**:
1. Deploy to staging
2. Run smoke tests
3. Deploy to production
4. Monitor for issues

**Deliverable**: Feature live in production

---

#### Step 7: @docs-writer - Documentation Update
**Duration**: 0.5-1 day

**Actions**:
1. Update API documentation
2. Update user guides
3. Update changelog

**Deliverable**: Updated documentation

---

## WORKFLOW #3: 🐛 Bug Resolution

**Trigger Keywords**: "bug", "error", "not working", "broken", "crash", "500 error", "fix"

**Use When**:
- Users report bugs
- Errors in logs
- Unexpected behavior
- Production incidents

### Quick Flow

```
@debugger (root cause analysis)
    ↓
@tech-lead (review & dev assignment)
    ↓
@backend-dev OR @frontend-dev OR @devops (fix)
    ↓
@tech-lead (code review)
    ↓
@qa-tester (verification & regression)
    ↓
@devops (hotfix deployment - if production)
```

### Detailed Steps

#### Step 1: @debugger - Bug Investigation
**Duration**: 1 hour - 1 day

**CRITICAL**: Always start with debugger for systematic investigation

**Actions**:
1. Reproduce bug consistently
2. Collect error logs, stack traces, and user reports
3. Research error using **WebSearch MCP**:
   - Search exact error messages
   - Check known issues in frameworks
   - Find CVEs if security-related
4. Analyze code execution path
5. Identify root cause:
   - Frontend issue (UI, state management)
   - Backend issue (API, database, logic)
   - Infrastructure issue (deployment, config, network)
   - Data issue (invalid data, migrations)
6. Determine severity (P0/P1/P2/P3)
7. Recommend which agent should fix it
8. Prepare reproduction steps and test cases

**Deliverable**: Root cause analysis with recommendation

**Handoff**: Report findings to @tech-lead for review and developer assignment

---

#### Step 2: @tech-lead - Bug Review & Developer Assignment
**Duration**: 15-30 minutes

**Actions**:
1. Review root cause analysis from @debugger
2. Validate severity assessment (P0/P1/P2/P3)
3. Assess impact on architecture or other systems
4. Determine best developer for the fix based on:
   - Area of codebase affected
   - Developer expertise
   - Current workload
5. Brief assigned developer on context and urgency
6. Set expectations for fix timeline and code review

**Deliverable**: Developer assignment with clear expectations

**Handoff**: @tech-lead assigns to @backend-dev, @frontend-dev, or @devops

---

#### Step 3a: @backend-dev - Backend Bug Fix
**Duration**: Hours to days

**When**: Backend logic, API, database, or server issue

**Actions**:
1. Read **agentweaver.config.yml**
2. Review root cause analysis from @debugger and assignment from @tech-lead
3. Implement fix with minimal changes
4. Add regression test to prevent recurrence
5. Verify fix locally
6. Update error handling if needed
7. Document the fix and root cause in commit message

**Deliverable**: Bug fix with regression test

**Handoff**: Submit fix to @tech-lead for code review

---

#### Step 3b: @frontend-dev - Frontend Bug Fix
**Duration**: Hours to days

**When**: UI, state management, or client-side issue

**Actions**:
1. Read **agentweaver.config.yml**
2. Review root cause analysis from @debugger and assignment from @tech-lead
3. Implement fix with minimal changes
4. Add regression test
5. Test across browsers if UI issue
6. Verify accessibility not broken
7. Document the fix and root cause in commit message

**Deliverable**: Bug fix with regression test

**Handoff**: Submit fix to @tech-lead for code review

---

#### Step 3c: @devops - Infrastructure Fix
**Duration**: Hours to days

**When**: Deployment, configuration, or infrastructure issue

**Actions**:
1. Review root cause analysis from @debugger
2. Fix configuration or infrastructure
3. Test in staging first
4. Update runbooks and documentation
5. Add monitoring to prevent recurrence

**Deliverable**: Infrastructure fix with updated docs

**Handoff**: Report fix to @tech-lead for review

---

#### Step 4: @tech-lead - Bug Fix Code Review
**Duration**: 15-30 minutes

**Actions**:
1. Review fix from assigned developer/devops
2. Verify root cause properly addressed
3. Check for potential side effects or regressions
4. Assess code quality and error handling
5. Approve for QA testing or request changes
6. Brief @qa-tester on testing focus areas

**Deliverable**: Code review approval

**Handoff**: @tech-lead approves handoff to @qa-tester for verification

---

#### Step 5: @qa-tester - Verification & Regression Testing
**Duration**: Hours to 1 day

**Actions**:
1. Verify bug is fixed
2. Test all related functionality
3. Run full regression test suite
4. Test edge cases
5. Verify across environments

**Deliverable**: Verification report

**Handoff**: Report test results to @tech-lead and @devops for deployment

---

#### Step 6: @devops - Hotfix Deployment (if production)
**Duration**: 30 minutes - 2 hours

**Actions**:
1. Deploy hotfix to production
2. Monitor error rates and metrics
3. Verify issue is resolved
4. Document incident

**Deliverable**: Deployed fix with incident report

---

## WORKFLOW #4: 🚀 Infrastructure & DevOps

**Trigger Keywords**: "deployment", "CI/CD", "Docker", "Kubernetes", "infrastructure", "devops"

**Use When**:
- Setting up CI/CD pipelines
- Deploying applications
- Scaling infrastructure
- Monitoring and observability
- DevOps improvements

### Quick Flow

```
@devops (assess and plan)
    ↓
@tech-lead (architectural review - if major changes)
    ↓
@devops (implement infrastructure)
    ↓
@qa-tester (smoke tests and validation)
    ↓
@devops (deploy and monitor)
    ↓
@docs-writer (update deployment docs)
```

### Detailed Steps

#### Step 1: @devops - Infrastructure Assessment
**Duration**: 1-2 days

**Actions**:
1. Assess current infrastructure
2. Identify issues or improvement opportunities
3. Research best practices using **WebSearch MCP**
4. Plan infrastructure changes
5. Estimate costs and timeline

**Deliverable**: Infrastructure improvement plan

---

#### Step 2: @tech-lead - Architectural Review (OPTIONAL)
**Duration**: 0.5-1 day

**When**: Major infrastructure changes affecting architecture

**Actions**:
1. Review infrastructure plan
2. Assess architectural impact
3. Identify risks and dependencies
4. Approve or suggest modifications

**Deliverable**: Architecture approval

---

#### Step 3: @devops - Implementation
**Duration**: Variable (days to weeks)

**Actions**:
1. Implement CI/CD pipeline
2. Set up Docker/Kubernetes
3. Configure monitoring and alerting
4. Set up auto-scaling (if needed)
5. Implement security hardening
6. Test in staging environment
7. Document changes

**Deliverable**: Infrastructure implementation

---

#### Step 4: @qa-tester - Smoke Tests
**Duration**: 0.5-1 day

**Actions**:
1. Run smoke tests with **Playwright MCP**
2. Verify all critical flows work
3. Test deployment process
4. Verify monitoring and alerts

**Deliverable**: Smoke test results

---

#### Step 5: @devops - Deploy & Monitor
**Duration**: Ongoing

**Actions**:
1. Deploy to production
2. Monitor metrics and logs
3. Verify performance improvements
4. Document lessons learned

**Deliverable**: Deployed infrastructure with monitoring

---

#### Step 6: @docs-writer - Documentation Update
**Duration**: 0.5-1 day

**Actions**:
1. Update deployment runbook
2. Document new infrastructure
3. Update troubleshooting guide

**Deliverable**: Updated documentation

---

## WORKFLOW #5: 📣 Marketing Campaign

**Trigger Keywords**: "marketing", "launch", "campaign", "promote", "SEO", "social media"

**Use When**:
- Product launch
- Marketing campaigns
- Content marketing
- SEO initiatives
- Social media campaigns

### Quick Flow

```
@marketing-manager (strategy and planning)
    ↓
@content-writer (content creation)
    ↓
@seo-specialist (SEO optimization)
    ↓
@social-media (social execution)
    ↓
@growth-marketer (track and optimize)
    ↓
@product-marketer (positioning and messaging)
```

### Detailed Steps

#### Step 1: @marketing-manager - Campaign Strategy
**Duration**: 1-2 weeks

**Actions**:
1. Define campaign objectives and KPIs
2. Research target audience using **WebSearch MCP**
3. Analyze competitors and market trends
4. Develop campaign messaging
5. Identify optimal channels and budget allocation
6. Create campaign timeline

**Deliverable**: Campaign strategy and plan

---

#### Step 2: @content-writer - Content Creation
**Duration**: 1-2 weeks

**Actions**:
1. Write campaign content assets
2. Create blog posts and articles
3. Write email campaigns
4. Create landing page copy
5. Write social media content

**Deliverable**: Campaign content

---

#### Step 3: @seo-specialist - SEO Optimization
**Duration**: 1 week

**Actions**:
1. Keyword research using **WebSearch MCP**
2. Optimize content for SEO
3. Build backlinks
4. Set up tracking

**Deliverable**: SEO-optimized content

---

#### Step 4: @social-media - Social Media Execution
**Duration**: Ongoing

**Actions**:
1. Create social media calendar
2. Schedule posts
3. Engage with audience
4. Monitor performance

**Deliverable**: Active social presence

---

#### Step 5: @growth-marketer - Optimization
**Duration**: Ongoing

**Actions**:
1. Track campaign metrics
2. A/B test variations
3. Optimize underperforming channels
4. Report on ROI

**Deliverable**: Optimized campaign performance

---

#### Step 6: @product-marketer - Positioning & Messaging
**Duration**: Ongoing

**Actions**:
1. Refine product positioning
2. Create competitive battlecards
3. Develop messaging framework
4. Support sales enablement

**Deliverable**: Product marketing assets

---

## WORKFLOW #6: 💰 Sales Process

**Trigger Keywords**: "sales", "pipeline", "CRM", "customers", "leads", "prospects"

**Use When**:
- Setting up sales process
- Managing sales pipeline
- Customer acquisition
- Sales enablement

### Quick Flow

```
@sales-manager (strategy and process)
    ↓
@sdr (prospecting and qualification)
    ↓
@account-exec (demos and closing)
    ↓
@sales-engineer (technical demos)
    ↓
@customer-success (onboarding and retention)
```

### Detailed Steps

#### Step 1: @sales-manager - Sales Strategy
**Duration**: 1-2 weeks

**Actions**:
1. Define ICP and target accounts
2. Create sales playbook
3. Set up CRM
4. Set quotas and territories
5. Train sales team

**Deliverable**: Sales process and strategy

---

#### Step 2: @sdr - Prospecting
**Duration**: Ongoing

**Actions**:
1. Prospect and research leads
2. Qualify leads (BANT, MEDDIC)
3. Set qualified meetings
4. Update CRM

**Deliverable**: Qualified leads

---

#### Step 3: @account-exec - Sales Execution
**Duration**: Variable

**Actions**:
1. Conduct discovery calls
2. Present product demos
3. Negotiate and close deals
4. Manage pipeline

**Deliverable**: Closed deals

---

#### Step 4: @sales-engineer - Technical Demos
**Duration**: Variable

**Actions**:
1. Conduct technical demos
2. Answer technical questions
3. Create POCs
4. Provide technical validation

**Deliverable**: Technical validation

---

#### Step 5: @customer-success - Onboarding & Retention
**Duration**: Ongoing

**Actions**:
1. Onboard new customers
2. Monitor customer health
3. Identify upsell opportunities
4. Reduce churn

**Deliverable**: Happy, retained customers

---

## WORKFLOW #7: 🏗️ Architecture Review & Tech Debt

**Trigger Keywords**: "refactor", "architecture", "performance", "tech debt", "optimize", "scalability"

**Use When**:
- Refactoring legacy code
- Performance optimization
- Addressing tech debt
- Architectural improvements

### Quick Flow

```
@tech-lead (identify issues and design strategy)
    ↓
@tech-lead (use Sequential Thinking MCP for complex decisions)
    ↓
@backend-dev OR @frontend-dev (implement refactoring)
    ↓
@qa-tester (regression testing)
    ↓
@tech-lead (code review and approval)
```

### Detailed Steps

#### Step 1: @tech-lead - Tech Debt Assessment
**Duration**: 2-5 days

**Actions**:
1. Identify tech debt and architecture issues
2. Assess impact and priority
3. Use **Sequential Thinking MCP** for complex decisions
4. Design refactoring strategy
5. Estimate effort and risks

**Deliverable**: Refactoring plan

---

#### Step 2: @backend-dev OR @frontend-dev - Implementation
**Duration**: Variable (weeks)

**Actions**:
1. Implement refactoring incrementally
2. Maintain backward compatibility
3. Add tests for refactored code
4. Update documentation

**Deliverable**: Refactored codebase

---

#### Step 3: @qa-tester - Regression Testing
**Duration**: 2-5 days

**Actions**:
1. Run full regression test suite
2. Verify no functionality broken
3. Performance testing
4. Document improvements

**Deliverable**: Test report

---

#### Step 4: @tech-lead - Code Review & Approval
**Duration**: 1-2 days

**Actions**:
1. Review refactored code
2. Verify best practices
3. Approve merge

**Deliverable**: Approved refactoring

---

## WORKFLOW #8: 📚 Documentation Sprint

**Trigger Keywords**: "documentation", "docs", "README", "API docs", "guide", "tutorial"

**Use When**:
- Creating new documentation
- Updating existing docs
- API documentation
- User guides and tutorials

### Quick Flow

```
@product-owner OR requester (define documentation requirements)
    ↓
@docs-writer (create/update documentation)
    ↓
@tech-lead (technical review)
    ↓
@backend-dev/@frontend-dev (provide technical input)
    ↓
@docs-writer (finalize and publish)
```

### Detailed Steps

#### Step 1: @product-owner - Documentation Requirements
**Duration**: 0.5-1 day

**Actions**:
1. Define what needs documenting
2. Identify target audience
3. Set priorities

**Deliverable**: Documentation requirements

---

#### Step 2: @docs-writer - Documentation Creation
**Duration**: Variable (days)

**Actions**:
1. Write comprehensive documentation
2. Add code examples and diagrams
3. Ensure clarity and accuracy

**Deliverable**: Documentation draft

---

#### Step 3: @tech-lead - Technical Review
**Duration**: 0.5-1 day

**Actions**:
1. Review for technical accuracy
2. Suggest improvements
3. Approve content

**Deliverable**: Reviewed documentation

---

#### Step 4: @backend-dev/@frontend-dev - Technical Input
**Duration**: As needed

**Actions**:
1. Provide code examples
2. Review technical sections
3. Answer questions

**Deliverable**: Technical contributions

---

#### Step 5: @docs-writer - Finalize & Publish
**Duration**: 0.5-1 day

**Actions**:
1. Incorporate feedback
2. Publish documentation
3. Update links and navigation

**Deliverable**: Published documentation

---

## 🔀 Workflow Transitions

Workflows are **composable** - you can transition between workflows as needed.

### Common Transitions

**Feature Development → Bug Resolution**:
```
Scenario: While implementing a feature, you discover a bug
Flow: Pause feature work → @debugger investigates → fix bug → resume feature
```

**Greenfield → Marketing Campaign**:
```
Scenario: MVP deployed, ready to market
Flow: Complete Phase 3 of Greenfield → Start Marketing Campaign workflow
```

**Bug Resolution → Architecture Review**:
```
Scenario: Bug reveals architectural issues
Flow: Fix immediate bug → @tech-lead assesses if architecture needs refactoring
```

### How to Transition

Claude Code will automatically suggest transitions:
```
"I see this bug reveals a larger architectural issue.
Should we:
A) Fix the immediate bug and schedule architecture review
B) Pause and start Architecture Review workflow now
C) Continue with current approach"
```

---

## 🎯 Workflow Detection Signals

Claude Code uses these signals to automatically detect which workflow to use:

### Greenfield Application
- No .claude directory exists
- Keywords: "build app from scratch", "new project", "MVP"
- User says: "I want to build..."

### Feature Development
- .claude directory exists
- agentweaver.config.yml exists
- Keywords: "add feature", "implement", "new functionality"
- User says: "Add authentication to my app"

### Bug Resolution
- Error messages or stack traces provided
- Keywords: "bug", "error", "broken", "crash", "fix"
- User says: "Users are getting 500 errors when..."

### Infrastructure/DevOps
- Keywords: "deploy", "CI/CD", "Docker", "production"
- User says: "Set up automated deployment"

### Marketing Campaign
- Product exists and deployed
- Keywords: "marketing", "launch", "SEO", "social media"
- User says: "I need to market my product"

### Sales Process
- Keywords: "sales", "CRM", "pipeline", "customers"
- User says: "Set up our sales process"

### Architecture Review
- Existing codebase
- Keywords: "refactor", "optimize", "architecture", "tech debt"
- User says: "Our code needs refactoring"

### Documentation
- Keywords: "documentation", "docs", "README"
- User says: "We need to document our API"

### UI/UX Design (Code-First)
- Keywords: "design", "UI", "component", "mockup", "layout", "responsive"
- User says: "Create a responsive card component"

---

## WORKFLOW #9: 🎨 UI/UX Design (Code-First)

**Trigger Keywords**: "design", "UI", "component", "mockup", "layout", "responsive", "accessibility"

**Use When**:
- Need new UI components
- Implementing design requirements
- Creating design system components
- Building responsive layouts
- Improving accessibility

### Quick Flow

```
@product-owner (design requirements)
    ↓
@ui-ux-dev (generate component code)
    ↓
Preview & user approval
    ↓
@tech-lead (code review)
    ↓
@frontend-dev (add functionality)
    ↓
@qa-tester (visual & functional testing)
```

### Detailed Steps

#### Step 1: @product-owner - Design Requirements
**Duration**: 0.5-1 day

**Actions**:
1. Define component requirements and use cases
2. Specify user interactions and behavior
3. Provide brand guidelines and design system context
4. List accessibility requirements (WCAG level)
5. Define responsive behavior across devices

**Deliverable**: Design requirements document

**Handoff**: Share requirements with @ui-ux-dev

---

#### Step 2: @ui-ux-dev - Component Generation
**Duration**: 0.5-2 days

**CRITICAL**: Uses code-first approach, generates production-ready components

**Actions**:
1. Read **agentweaver.config.yml** for design system configuration
2. Query **shadcn/ui MCP** for component patterns:
   ```
   mcp__shadcn-ui-server__list-components
   mcp__shadcn-ui-server__get-component-docs with component: "button"
   ```
3. Generate component code with:
   - React/Vue/Svelte based on tech stack
   - Tailwind CSS styling
   - WCAG 2.1 AA accessibility (semantic HTML, ARIA, keyboard nav)
   - Responsive breakpoints (mobile-first)
   - Dark mode support
4. Create visual preview (HTML/browser)
5. Document component usage and props

**MCP Usage**:
- **shadcn/ui**: Get proven component patterns
- **Context7**: Research design system best practices
- **Sequential Thinking**: Complex layout decisions
- **Playwright**: Generate screenshots for preview

**Deliverable**: Component code with visual preview

**Handoff**: Present to user for approval, then submit to @tech-lead

---

#### Step 3: User Approval & Iteration
**Duration**: 0.5-1 day

**Actions**:
1. Review visual preview in browser
2. Test responsive behavior (resize browser)
3. Provide feedback on design, layout, interactions
4. Request changes if needed
5. @ui-ux-dev iterates based on feedback

**Deliverable**: Approved component design

---

#### Step 4: @tech-lead - Code Review
**Duration**: 0.5 day

**Actions**:
1. Review component code quality:
   - TypeScript types properly defined
   - Props are clear and well-documented
   - Code follows project conventions
2. Verify accessibility implementation:
   - Semantic HTML used
   - ARIA labels where needed
   - Keyboard navigation works
   - Color contrast meets WCAG AA
3. Check responsive design approach:
   - Mobile-first implementation
   - Breakpoints match design system
   - Touch-friendly (44x44px minimum)
4. Ensure design system adherence:
   - Uses design tokens (colors, spacing, typography)
   - Follows component patterns
   - Consistent with existing components
5. Approve for frontend integration

**Deliverable**: Code review approval

**Handoff**: @tech-lead delegates to @frontend-dev for functionality integration

---

#### Step 5: @frontend-dev - Functionality Integration
**Duration**: 0.5-2 days

**Actions**:
1. Integrate component into application:
   - Import component into relevant pages
   - Place in appropriate layout structure
2. Add state management:
   - Connect to Redux/Zustand/Context
   - Implement local component state
3. Connect to API/backend:
   - Fetch data for component
   - Handle loading/error states
4. Add event handlers and business logic:
   - Form submissions
   - Button click handlers
   - Navigation logic
5. Write unit tests for component logic:
   - Test state changes
   - Test event handlers
   - Test API integration

**Deliverable**: Fully functional component

**Handoff**: Submit to @tech-lead for final review, then @qa-tester

---

#### Step 6: @qa-tester - Visual & Functional Testing
**Duration**: 0.5-1 day

**Actions**:
1. Test visual appearance across browsers:
   - Chrome, Firefox, Safari, Edge
   - Check for layout issues
2. Test responsive behavior:
   - Mobile devices (320px, 375px, 414px)
   - Tablets (768px, 1024px)
   - Desktop (1280px, 1920px)
3. Test accessibility:
   - Keyboard navigation (Tab, Enter, Space, Arrow keys)
   - Screen reader announcements (NVDA, JAWS, VoiceOver)
   - Color contrast (use WebAIM Contrast Checker)
   - Focus indicators visible
4. Test functionality and interactions:
   - All buttons and links work
   - Forms submit correctly
   - Validation messages display
   - Loading states render
5. Run visual regression tests with Playwright:
   ```
   mcp__playwright__browser_snapshot
   mcp__playwright__browser_take_screenshot
   ```

**Deliverable**: Test results and approval

**Handoff**: If bugs found, return to @frontend-dev. If passed, ready for deployment via @devops.

---

### Common Scenarios

#### Scenario 1: New Component from Scratch
**Example**: "Create a responsive blog post card component"

**Flow**:
1. @product-owner defines requirements (image, title, excerpt, author, date, link)
2. @ui-ux-dev queries shadcn/ui for card patterns
3. @ui-ux-dev generates component with Tailwind CSS
4. User approves visual preview
5. @tech-lead reviews code
6. @frontend-dev adds blog data fetching
7. @qa-tester validates across devices

#### Scenario 2: Design System Foundation
**Example**: "Build a component library for our app"

**Flow**:
1. @product-owner provides brand guidelines
2. @ui-ux-dev creates base components:
   - Button variants (primary, secondary, ghost, danger)
   - Form inputs (text, select, checkbox, radio)
   - Cards and containers
   - Navigation elements
3. @tech-lead reviews component library
4. @frontend-dev integrates into app
5. @qa-tester validates consistency

#### Scenario 3: Responsive Layout
**Example**: "Create a responsive dashboard layout"

**Flow**:
1. @product-owner defines dashboard sections
2. @ui-ux-dev designs mobile-first grid layout
3. @ui-ux-dev implements responsive breakpoints
4. User tests on multiple devices
5. @tech-lead reviews layout approach
6. @frontend-dev adds dashboard data
7. @qa-tester validates responsive behavior

---

### Integration with Other Workflows

#### Greenfield Workflow
Add **Step 4.5** (parallel to backend/frontend setup):

**Step 4.5**: @ui-ux-dev - Component Library & Design System
- Duration: 1-2 weeks
- Establish design system foundation
- Generate base components
- Create component documentation

#### Feature Development Workflow
Add **Optional Step 2.5** (after tech-lead review):

**Step 2.5**: @ui-ux-dev - UI Component Generation (if UI changes)
- Duration: 0.5-2 days
- Generate new components or modify existing
- Get user approval on visual design
- Submit to tech-lead for code review

---

### Quality Gates

**Before User Approval**:
- [ ] Component matches requirements
- [ ] Visual preview generated
- [ ] Responsive behavior works
- [ ] Accessibility features visible

**Before Tech-Lead Approval**:
- [ ] WCAG 2.1 AA accessibility achieved
- [ ] Design system tokens applied
- [ ] TypeScript types defined
- [ ] Props documented

**Before Frontend Integration**:
- [ ] Code review passed
- [ ] No accessibility violations
- [ ] Responsive breakpoints correct

**Before Deployment**:
- [ ] Functional tests passing
- [ ] Visual regression tests passing
- [ ] Cross-browser testing complete
- [ ] Accessibility testing complete

---

## 💡 Best Practices

### 1. Trust the Workflow
- Let Claude Code suggest the appropriate workflow
- You can always modify or skip steps

### 2. Read agentweaver.config.yml
- All technical agents should read the config file
- Ensures consistency across agents

### 3. Update Config When Needed
- @tech-lead updates agentweaver.config.yml during Greenfield
- Review and approve changes

### 4. Use Parallel Execution
- @backend-dev and @frontend-dev can work simultaneously
- Coordinate on API contracts

### 5. Workflow Composition
- Switch workflows as needed
- Bug fixes can happen during feature development

### 6. Communication is Key
- Agents should announce what they're doing
- Use @mentions to handoff clearly

### 7. Validate Before Completing
- Every agent has a validation checklist
- Don't skip quality checks

---

## 📚 Additional Resources

- [Agent Templates](.claude/agents/) - Individual agent documentation
- [Skills Library](.claude/skills/) - Reusable implementation patterns
- [Tech Stack Configuration](.claude/agentweaver.config.yml) - Project tech stack
- [MCP Server Documentation](https://docs.claude.com/mcp) - MCP server guides

---

**Questions or Feedback?**
This is a living document. As you use these workflows, suggest improvements!
