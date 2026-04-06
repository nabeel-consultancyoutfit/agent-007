# REST API Conventions

## NestJS Module Pattern
Every feature is a self-contained module:
- [feature].module.ts: imports, providers, controllers, exports
- [feature].controller.ts: routes, guards, swagger decorators
- [feature].service.ts: business logic, calls repository/mongoose model
- schemas/[feature].schema.ts: mongoose schema with decorators
- dto/create-[feature].dto.ts: validated input shape
- dto/update-[feature].dto.ts: extends PartialType(CreateDto)

## Standard Response Shape
Every endpoint returns:
```json
{ "success": true, "data": {}, "message": "Operation successful", "errors": null }
```
Error responses:
```json
{ "success": false, "data": null, "message": "Validation failed", "errors": { "email": "Invalid email format" } }
```

## Pagination
GET list endpoints accept: page, pageSize, sortBy, sortOrder, search
Return:
```json
{
  "data": [],
  "total": 100,
  "page": 1,
  "pageSize": 10,
  "totalPages": 10
}
```
Default pageSize: 10. Max pageSize: 100. Default sortOrder: 'desc'.

## HTTP Status Codes
- 200 → success GET/PATCH
- 201 → success POST (resource created)
- 400 → validation error (bad input)
- 401 → not authenticated
- 403 → not authorized (authenticated but lacks permission)
- 404 → resource not found
- 422 → unprocessable entity (valid syntax, invalid semantics)
- 500 → server error (unexpected)

## Swagger Decorators
- @ApiTags('feature') on controller class
- @ApiOperation({ summary: '...' }) on every method
- @ApiResponse({ status: 200, type: ResponseDto }) on every method
- @ApiBearerAuth() on protected controllers
- @ApiQuery({ name: 'page', required: false }) on paginated endpoints

## class-validator Patterns
- @IsString() @IsNotEmpty() for required strings
- @IsEmail() for email fields
- @IsOptional() for optional fields
- @IsEnum(EnumType) for enum fields
- @Min(1) @Max(100) for number ranges
- @MinLength(8) for passwords
- @Matches(/regex/) for format validation
- @Type(() => Number) with class-transformer for query params
- Always use whitelist: true in ValidationPipe to strip unknown properties

## Error Handling
- Global HttpExceptionFilter catches all exceptions
- Transform all errors to standard response shape
- Log 500 errors with full stack trace
- Never expose internal error details to clients
- Use custom exception classes for domain errors

## Naming Conventions
- Controllers: PascalCase with .controller.ts suffix
- Services: PascalCase with .service.ts suffix
- DTOs: kebab-case with .dto.ts suffix (create-user.dto.ts)
- Schemas: kebab-case with .schema.ts suffix
- Routes: plural nouns, kebab-case (/api/user-profiles)
