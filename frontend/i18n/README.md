# Frontend internationalization

Translations are grouped by feature so the dictionary remains easy to search as
the application grows:

```text
i18n/messages/
├── shared.ts   # brand, navigation, metadata, errors
├── home.ts     # home page and its visual components
├── auth.ts     # login, registration, OTP and validation
├── student.ts  # student shell and student pages
├── types.ts    # strict dictionary shape helpers
└── index.ts    # combines feature dictionaries
```

## Add or change text

1. Open the file matching the page or feature.
2. Add the same key to its `bn` and `en` objects.
3. Read it in a client component with:

```tsx
const { messages } = useI18n();
return <h1>{messages.auth.loginTitle}</h1>;
```

For server components, validate `params.locale` and call `getMessages(locale)`.
TypeScript checks both languages against the Bangla structure. A missing or
misspelled English key therefore fails the build instead of failing in production.

## Add a new feature

Copy the pattern from `messages/auth.ts`, export (for example)
`lessonMessages`, and spread both languages into `messages/index.ts`. Keep a
feature's page and component copy together unless that text is truly shared.

Use `LocalizedLink` for internal links. Never append `lang` to API calls by hand:
the shared Axios interceptor adds `lang=ban` or `lang=eng` from the URL.
