---
name: UI State Management
description: Comprehensive patterns for managing application state in React using Zustand, Redux Toolkit, Context API, and deciding when to use each approach.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Bash
  - WebFetch
tags:
  - ui
  - state-management
  - react
  - zustand
  - redux
  - context-api
  - typescript
mcp-servers:
  - playwright
  - context7
---

# UI State Management Skill

Master modern state management patterns in React applications, understanding when to use local state, Context API, Zustand, or Redux Toolkit for optimal performance and maintainability.

## 🎯 Before You Start

**IMPORTANT**: When using this skill, follow these steps:

1. **Build a Todo List**: Use TodoWrite to break down the implementation into clear steps
2. **Gather Clarification**: Ask about requirements, constraints, and expected outcomes
3. **Understand Context**: Read existing code patterns and project conventions
4. **Execute Transparently**: Mark todos in_progress/completed as you work
5. **Validate**: Test your implementation and verify it meets requirements

**Example approach for this skill**:
Identify state requirements, choose appropriate state management solution (local, Context, Zustand, Redux), implement state logic, optimize re-renders, test state updates and edge cases.

**Additional tools available**:
- Use Playwright MCP for testing state-driven UI interactions
- Use Context7 MCP for state management library documentation

## When to Use

- Managing global application state
- Sharing state between distant components
- Implementing complex state logic with multiple actions
- Persisting state to localStorage or sessionStorage
- Optimizing performance with selective re-renders
- Building scalable applications with predictable state updates

## State Management Decision Tree

### Choose Based on Complexity

**Local State (useState, useReducer)**
- Single component state
- Simple form inputs
- UI toggles and modals
- No need to share across components

**Context API**
- Theme preferences
- User authentication status
- Localization/i18n
- Rarely changing global state
- Small to medium apps

**Zustand**
- Moderate complexity global state
- Need simple API with minimal boilerplate
- Want built-in DevTools support
- Partial state subscriptions for performance
- Medium to large apps

**Redux Toolkit**
- Large-scale applications
- Complex state interactions
- Time-travel debugging required
- Team familiar with Redux patterns
- Strict architectural requirements
- Enterprise applications

## Local State Patterns

### useState for Simple State
```tsx
import { useState } from 'react';

interface FormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <form>
      <input
        type="email"
        value={formData.email}
        onChange={handleChange('email')}
      />
      <input
        type="password"
        value={formData.password}
        onChange={handleChange('password')}
      />
    </form>
  );
};
```

### useReducer for Complex Logic
```tsx
import { useReducer } from 'react';

interface State {
  count: number;
  step: number;
  history: number[];
}

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'set_step'; payload: number }
  | { type: 'reset' };

const initialState: State = {
  count: 0,
  step: 1,
  history: [0],
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'increment':
      const newCount = state.count + state.step;
      return {
        ...state,
        count: newCount,
        history: [...state.history, newCount],
      };

    case 'decrement':
      const decrementedCount = state.count - state.step;
      return {
        ...state,
        count: decrementedCount,
        history: [...state.history, decrementedCount],
      };

    case 'set_step':
      return {
        ...state,
        step: action.payload,
      };

    case 'reset':
      return initialState;

    default:
      return state;
  }
};

const Counter: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <input
        type="number"
        value={state.step}
        onChange={(e) =>
          dispatch({ type: 'set_step', payload: Number(e.target.value) })
        }
      />
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
};
```

## Context API Patterns

### Creating Type-Safe Context
```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const userData = await response.json();
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Usage
const Profile: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return <p>Not logged in</p>;

  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### Optimizing Context Performance
```tsx
import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

// Split context into state and actions
const ThemeStateContext = createContext<string | undefined>(undefined);
const ThemeActionsContext = createContext<{
  setTheme: (theme: string) => void;
} | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState('light');

  // Memoize actions to prevent re-renders
  const actions = useMemo(() => ({ setTheme }), []);

  return (
    <ThemeStateContext.Provider value={theme}>
      <ThemeActionsContext.Provider value={actions}>
        {children}
      </ThemeActionsContext.Provider>
    </ThemeStateContext.Provider>
  );
};

// Separate hooks for state and actions
export const useTheme = () => {
  const context = useContext(ThemeStateContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

export const useThemeActions = () => {
  const context = useContext(ThemeActionsContext);
  if (!context)
    throw new Error('useThemeActions must be used within ThemeProvider');
  return context;
};
```

## Zustand Patterns

### Basic Zustand Store
```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoStore {
  todos: Todo[];
  addTodo: (title: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  clearCompleted: () => void;
}

export const useTodoStore = create<TodoStore>()(
  devtools(
    persist(
      (set) => ({
        todos: [],

        addTodo: (title) =>
          set((state) => ({
            todos: [
              ...state.todos,
              {
                id: crypto.randomUUID(),
                title,
                completed: false,
              },
            ],
          })),

        toggleTodo: (id) =>
          set((state) => ({
            todos: state.todos.map((todo) =>
              todo.id === id ? { ...todo, completed: !todo.completed } : todo
            ),
          })),

        removeTodo: (id) =>
          set((state) => ({
            todos: state.todos.filter((todo) => todo.id !== id),
          })),

        clearCompleted: () =>
          set((state) => ({
            todos: state.todos.filter((todo) => !todo.completed),
          })),
      }),
      {
        name: 'todo-storage', // localStorage key
      }
    )
  )
);

// Usage in component
const TodoList: React.FC = () => {
  const todos = useTodoStore((state) => state.todos);
  const toggleTodo = useTodoStore((state) => state.toggleTodo);

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
          <span>{todo.title}</span>
        </li>
      ))}
    </ul>
  );
};
```

### Zustand with Immer for Immutability
```typescript
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartStore>()(
  immer((set, get) => ({
    items: [],

    addItem: (item) =>
      set((state) => {
        const existingItem = state.items.find((i) => i.id === item.id);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          state.items.push({ ...item, quantity: 1 });
        }
      }),

    updateQuantity: (id, quantity) =>
      set((state) => {
        const item = state.items.find((i) => i.id === id);
        if (item) {
          item.quantity = quantity;
        }
      }),

    removeItem: (id) =>
      set((state) => {
        state.items = state.items.filter((i) => i.id !== id);
      }),

    clearCart: () =>
      set((state) => {
        state.items = [];
      }),

    total: () => {
      const state = get();
      return state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },
  }))
);
```

### Zustand Slices Pattern
```typescript
import { create, StateCreator } from 'zustand';

// User slice
interface UserSlice {
  user: User | null;
  setUser: (user: User | null) => void;
}

const createUserSlice: StateCreator<
  UserSlice & NotificationSlice,
  [],
  [],
  UserSlice
> = (set) => ({
  user: null,
  setUser: (user) => set({ user }),
});

// Notification slice
interface NotificationSlice {
  notifications: string[];
  addNotification: (message: string) => void;
  clearNotifications: () => void;
}

const createNotificationSlice: StateCreator<
  UserSlice & NotificationSlice,
  [],
  [],
  NotificationSlice
> = (set) => ({
  notifications: [],
  addNotification: (message) =>
    set((state) => ({
      notifications: [...state.notifications, message],
    })),
  clearNotifications: () => set({ notifications: [] }),
});

// Combine slices
export const useAppStore = create<UserSlice & NotificationSlice>()((...a) => ({
  ...createUserSlice(...a),
  ...createNotificationSlice(...a),
}));
```

## Redux Toolkit Patterns

### Setting Up Redux Store
```typescript
// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import todosReducer from './slices/todosSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['todos/addTodo'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### Creating a Slice
```typescript
// slices/todosSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodosState {
  items: Todo[];
  loading: boolean;
  error: string | null;
}

const initialState: TodosState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunk for API calls
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await fetch('/api/todos');
  return (await response.json()) as Todo[];
});

export const addTodoAsync = createAsyncThunk(
  'todos/addTodo',
  async (title: string) => {
    const response = await fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
    return (await response.json()) as Todo;
  }
);

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.items.push({
        id: crypto.randomUUID(),
        title: action.payload,
        completed: false,
      });
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.items.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch todos';
      })
      .addCase(addTodoAsync.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export const { addTodo, toggleTodo, removeTodo } = todosSlice.actions;
export default todosSlice.reducer;
```

### Using Redux in Components
```tsx
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store';
import { fetchTodos, toggleTodo, addTodo } from './slices/todosSlice';

const TodoList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.todos);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAddTodo = (title: string) => {
    dispatch(addTodo(title));
  };

  const handleToggle = (id: string) => {
    dispatch(toggleTodo(id));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <ul>
        {items.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id)}
            />
            <span>{todo.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

### RTK Query for API Calls
```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export const todosApi = createApi({
  reducerPath: 'todosApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Todo'],
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], void>({
      query: () => 'todos',
      providesTags: ['Todo'],
    }),
    addTodo: builder.mutation<Todo, Partial<Todo>>({
      query: (todo) => ({
        url: 'todos',
        method: 'POST',
        body: todo,
      }),
      invalidatesTags: ['Todo'],
    }),
    updateTodo: builder.mutation<Todo, Todo>({
      query: ({ id, ...patch }) => ({
        url: `todos/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Todo'],
    }),
    deleteTodo: builder.mutation<void, string>({
      query: (id) => ({
        url: `todos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Todo'],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todosApi;

// Usage
const TodoList: React.FC = () => {
  const { data: todos, isLoading, error } = useGetTodosQuery();
  const [addTodo] = useAddTodoMutation();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading todos</div>;

  return (
    <ul>
      {todos?.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
};
```

## State Persistence

### Zustand Persistence
```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface PreferencesStore {
  theme: 'light' | 'dark';
  language: string;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: string) => void;
}

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      theme: 'light',
      language: 'en',
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'preferences-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
      }),
    }
  )
);
```

### Redux Persistence
```typescript
import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth', 'preferences'], // Only persist these reducers
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
```

## Performance Optimization

### Memoization and Selectors
```typescript
// Zustand with selectors
import { create } from 'zustand';
import { shallow } from 'zustand/shallow';

// Only re-render when specific values change
const TodoItem: React.FC<{ id: string }> = ({ id }) => {
  const todo = useTodoStore(
    (state) => state.todos.find((t) => t.id === id),
    shallow
  );

  return <div>{todo?.title}</div>;
};

// Redux with Reselect
import { createSelector } from '@reduxjs/toolkit';

const selectTodos = (state: RootState) => state.todos.items;
const selectCompletedTodos = createSelector([selectTodos], (todos) =>
  todos.filter((todo) => todo.completed)
);

const CompletedTodos: React.FC = () => {
  const completedTodos = useAppSelector(selectCompletedTodos);
  return <div>{completedTodos.length} completed</div>;
};
```

## Best Practices

### Do's
- Start with local state, lift up only when needed
- Use Context for rarely changing global state
- Choose Zustand for simple global state management
- Use Redux Toolkit for complex enterprise apps
- Persist only necessary state to storage
- Create typed hooks for type safety
- Split large stores into slices
- Use selectors to optimize re-renders
- Keep state normalized (avoid deep nesting)
- Test state logic independently

### Don'ts
- Don't put everything in global state
- Don't mutate state directly (except with Immer)
- Don't create too many separate stores
- Don't over-optimize prematurely
- Don't mix state management solutions unnecessarily
- Don't ignore TypeScript errors
- Don't forget to handle loading and error states
- Don't put derived state in the store

## Comparison Summary

| Feature | useState | Context | Zustand | Redux Toolkit |
|---------|----------|---------|---------|---------------|
| Boilerplate | Minimal | Low | Low | Medium |
| Learning Curve | Easy | Easy | Easy | Medium |
| DevTools | No | No | Yes | Yes |
| Middleware | No | No | Yes | Yes |
| Performance | Good | Can cause re-renders | Excellent | Excellent |
| TypeScript | Good | Good | Excellent | Excellent |
| Persistence | Manual | Manual | Built-in | With library |
| Best For | Local state | Theme/Auth | Most apps | Enterprise |

## Resources

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Context API](https://react.dev/reference/react/useContext)
- [State Management Comparison](https://www.robinwieruch.de/react-state-management/)
- [When to use Zustand vs Redux](https://dev.to/alexkhismatulin/zustand-vs-redux-differences-and-use-cases-3l7m)
