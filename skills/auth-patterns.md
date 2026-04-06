# Auth Patterns

## JWT Flow
1. User logs in → backend returns accessToken (15min) in response body
2. refreshToken (7 days) set as httpOnly cookie by backend
3. Frontend stores accessToken in memory (Redux store — never localStorage)
4. Every request includes: Authorization: Bearer <accessToken>
5. On 401 → frontend calls /auth/refresh → gets new accessToken → retry original request
6. On refresh fail → logout → redirect to /login

## Backend Auth Setup
- Passport LocalStrategy for login (validates email + password)
- Passport JwtStrategy for protected routes (validates Bearer token)
- @UseGuards(LocalAuthGuard) on POST /auth/login
- @UseGuards(JwtAuthGuard) on all protected routes
- Refresh token stored hashed in MongoDB on user document
- cookie-parser middleware in main.ts
- bcrypt for password hashing (salt rounds: 10)
- ConfigService for all JWT secrets and expiry values

### User Schema
```typescript
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop()
  refreshToken: string

  @Prop({ default: 'user', enum: ['user', 'admin'] })
  role: string
}
```

### Auth Endpoints
- POST /auth/register → create user, return tokens
- POST /auth/login → validate credentials, return tokens
- POST /auth/refresh → validate refresh cookie, return new access token
- POST /auth/logout → clear refresh token, clear cookie

## Frontend Auth Setup
- RTK Query auth endpoints in lib/api/endpoints/auth.api.ts
- accessToken stored in Redux auth slice (never localStorage)
- baseApi prepareHeaders: reads token from Redux store, sets Authorization header
- Middleware in middleware.ts: redirect unauthenticated users to /login
- Public routes: /login, /register (no auth required)
- Protected routes: /dashboard and all sub-routes

### Auth Slice Shape
```typescript
interface AuthState {
  accessToken: string | null
  user: { id: string; email: string; role: string } | null
}
```

### Token Refresh Flow (RTK Query)
- Use baseQueryWithReauth wrapper around fetchBaseQuery
- On 401 response: call /auth/refresh endpoint
- If refresh succeeds: update token in store, retry original request
- If refresh fails: clear auth state, redirect to /login

## Role-Based Access
- Roles decorator: @Roles('admin') on controller methods
- RolesGuard checks user.role against required roles
- Always apply JwtAuthGuard before RolesGuard
- Frontend: conditionally render UI based on user.role from Redux store
