## 1. Language & Type Safety (Non-Negotiable)

**Rules**

- All backend code **must be written in TypeScript**
- `strict: true` **must** be enabled in `tsconfig.json`
- `any` is **strictly forbidden**
    - Use `unknown` when the type is initially uncertain
- Strong typing is mandatory for:
    - Controllers
    - Services
    - DTOs
    - Repositories
    - External integrations

**Copilot Guidance**

- Never generate `any`
- Always infer explicit return types
- Prefer domain-specific types over primitives

> Rule:
> 
> 
> If it’s not typed, it’s not production-ready.
> 

---

## 2. Linting, Formatting & Code Quality

**Rules**

- ESLint is **mandatory** for all NestJS services
- No lint warnings or errors are allowed in:
    - CI pipelines
    - Production builds
- Formatting must be automated using:
    - ESLint rules
    - Pre-commit hooks (recommended)

**Copilot Guidance**

- Generate code that passes ESLint by default
- Never suppress lint rules unless explicitly justified

**Why**

Consistency reduces review friction and long-term technical debt.

---

## 3. Standard API Response Contract (Strict)

All APIs **must** follow the same response structure.

### Allowed Response Format (Exact)

```json
{
  "success": true,
  "message": "Some message",
  "data": {},
  "error": {}
}

```

### Rules

- ❌ No additional fields allowed at the root level
- `success`
    - `true` → successful execution
    - `false` → validation or runtime error
- `message`
    - Mandatory
    - Human-readable
- `data`
    - Contains all successful response payloads
- `error`
    - Contains validation or runtime errors
    - Must be `{}` on success

**Copilot Guidance**

- Always wrap responses using this contract
- Never return raw objects or arrays

---

## 4. Controller Responsibilities (Strict Boundary)

**Controllers must:**

- Accept requests
- Validate input (DTOs / Pipes)
- Call services
- Return standardized responses

**Controllers must NOT:**

- Contain business logic
- Access database clients
- Call third-party SDKs
- Handle sockets, queues, or events

> Principle:
> 
> 
> Controllers orchestrate. Services execute.
> 

**Copilot Guidance**

- Keep controllers thin
- Delegate everything except request orchestration

---

## 5. Service Layer & Business Logic

**Rules**

- All business logic **must** live in services
- Services must be:
    - Stateless
    - Injectable
    - Domain-focused
- Large services must be split by responsibility

**Recommended Structure**

```
src/modules/user/
 ├── user.controller.ts
 ├── user.service.ts
 ├── user.module.ts
 └── dto/

```

**Copilot Guidance**

- Do not mix unrelated responsibilities in one service
- Prefer multiple small services over one large service

---

## 6. DTOs & Validation

**Rules**

- Every API must define DTOs for:
    - Request bodies
    - Query parameters
    - Path parameters
- Mandatory libraries:
    - `class-validator`
    - `class-transformer`
- Validation must occur **before** business logic

**Copilot Guidance**

- Never accept raw request payloads
- Always validate and transform inputs

> Never trust client input.
> 

---

## 7. Error Handling Strategy

**Rules**

- Never return:
    - Raw errors
    - Stack traces
    - Internal messages
- Use:
    - `HttpException`
    - Custom exception classes
    - Global exception filters
- Error responses must:
    - Follow standard API contract
    - Provide meaningful user messages
    - Hide internal details

**Copilot Guidance**

- Always throw typed exceptions
- Never leak internal error context

---

## 8. Sockets, Queues & IO Operations

**Rules**

- All IO-based operations must be implemented as **classes**
- Includes:
    - WebSockets
    - Message queues (RabbitMQ, SQS, etc.)
    - Event emitters & listeners
- These classes must be:
    - Injectable
    - Reusable
    - Isolated from controllers

**Required Structure**

```
src/io/
 ├── socket.manager.ts
 ├── queue.publisher.ts
 ├── queue.consumer.ts
 └── event.dispatcher.ts

```

**Copilot Guidance**

- Never initialize IO inside controllers
- Always centralize connection lifecycle handling

**Why**

Prevents duplication, leaks, and race conditions.

---

## 9. Third-Party Integrations

**Rules**

- All third-party SDKs must:
    - Be wrapped inside dedicated classes
    - Live in an `integrations` folder
- No direct SDK usage inside controllers or services

**Required Structure**

```
src/integrations/
 ├── aws.integration.ts
 ├── stripe.integration.ts
 └── ghl.integration.ts

```

> Rule:
> 
> 
> External dependencies must be isolated and mockable.
> 

**Copilot Guidance**

- Treat third-party services as unstable dependencies
- Always abstract them behind interfaces

---

## 10. Authentication & Cookies (Critical)

**Rules**

- Auth tokens:
    - Must be set as **HTTP-only cookies**
    - Must be created **only by the Auth Service**
- Frontend:
    - Must NOT set, modify, or manage auth cookies
- Backend:
    - Owns cookie lifecycle (creation, rotation, expiry, revocation)

**Copilot Guidance**

- Never expose tokens in JSON responses
- Never allow frontend to control auth cookies

**Why**

Prevents XSS attacks and enforces clean auth boundaries.

---

## 11. Authorization & Access Control

**Rules**

- All protected APIs must:
    - Validate authentication
    - Enforce authorization (roles / permissions)
- Authorization must be implemented using:
    - Guards
    - Middleware
- Never trust:
    - Client-side role checks
    - Client-provided IDs

**Copilot Guidance**

- Always verify permissions on the server
- Assume client input is malicious

---

## 12. Database & Repository Pattern

**Rules**

- Controllers and services must NOT access DB clients directly
- Use repository / data-access layers
- Queries must be:
    - Parameterized
    - Performance-reviewed
    - Secure against injection

**Copilot Guidance**

- Never embed raw queries in controllers
- Keep persistence logic isolated

---

## 13. Configuration & Environment Management

**Rules**

- No hardcoded configuration values
- All configuration must come from:
    - Environment variables
    - Config modules
- Secrets must never be:
    - Logged
    - Returned in responses
    - Committed to the repository

**Copilot Guidance**

- Use config services instead of `process.env` directly

---

## 14. Logging & Observability

**Rules**

- Use structured logging
- Logs must include:
    - Request IDs
    - Error context
    - External service failures
- Never log:
    - Tokens
    - Passwords
    - PII

**Copilot Guidance**

- Logs must help debugging, not add noise