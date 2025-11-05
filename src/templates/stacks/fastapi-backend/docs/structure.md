# FastAPI Project Structure - Vertical Slice Architecture

```
app/
├── main.py
├── features/                    # Vertical slices
│   ├── auth/
│   │   ├── router.py
│   │   ├── service.py
│   │   ├── models.py
│   │   └── schemas.py
│   ├── users/
│   └── ...
├── lib/                         # Shared
│   ├── db/
│   └── utils/
└── common/                      # Shared
    ├── dependencies.py
    └── middleware.py
```

See Next.js template structure.md for detailed VSA principles.
