# TypeScript in the Frontend

## Overview
This guide covers TypeScript usage in our monorepo's frontend applications, specifically for React components and hooks.

## Basic Types
```typescript
// Common types used in our frontend
interface User {
  id: string;
  email: string;
  name?: string;  // Optional property
}

// React component props
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

// API response types
interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

// Union types for variants
type ButtonVariant = 'primary' | 'secondary' | 'danger';
```

## React Components
```typescript
// Function component with props
const Button: React.FC<ButtonProps> = ({ onClick, children, disabled }) => {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className="px-4 py-2 bg-blue-500"
    >
      {children}
    </button>
  );
};

// Generic component example
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}
```

## Hooks
```typescript
// useState with type inference
const [user, setUser] = useState<User | null>(null);

// Custom hook example
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Login logic
    } catch (error) {
      // Error handling
    } finally {
      setIsLoading(false);
    }
  };

  return { user, isLoading, login };
};

// useEffect with cleanup
useEffect(() => {
  const subscription = someService.subscribe();
  
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

## Event Handling
```typescript
// Form events
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // Form submission logic
};

// Input events
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
};

// Custom events
interface CustomEvent {
  type: string;
  payload: unknown;
}

const handleCustomEvent = (event: CustomEvent) => {
  // Handle custom event
};
```

## Best Practices

### 1. Type Imports/Exports
When we work with TypeScript, we often want to share our type definitions across files. Here's how:

```typescript
// types/user.ts - This is where we define our User type
export interface User {
  id: string;
  email: string;
}

// components/UserProfile.tsx - This is where we use the User type
import type { User } from '../types/user';
// The 'type' keyword tells TypeScript we're only importing the type, not code
```

### 2. Props Typing
There are two main ways to define types in TypeScript. Here's when to use each:

```typescript
// Use 'interface' for component props - it's clearer for other developers
interface CardProps {
  title: string;    // The card's title
  content: string;  // The card's content
}

// Use 'type' for simple options - like different button styles
type ButtonVariant = 'primary' | 'secondary' | 'danger';
// This means a button can only be one of these three styles
```

### 3. Context Typing
React Context lets us share data throughout our app. TypeScript helps make it safer:

```typescript
// Define what data and functions our Context will share
interface AuthContext {
  user: User | null;  // The current user (or null if not logged in)
  login: (email: string, password: string) => Promise<void>;  // Login function
  logout: () => void;  // Logout function
}

// Create the Context with these types
const AuthContext = React.createContext<AuthContext | null>(null);

// A helper function to use our Context safely
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // If someone tries to use the Context outside of a provider, show a helpful error
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
```

## Troubleshooting

### Common Issues
Here are problems you'll often see and how to fix them:

1. `Type 'string' is not assignable to type 'number'`
   - This means you're trying to use a string where a number is needed
   - Example: `<Input value={5} />` works, but `<Input value="5" />` needs fixing
   - Always check what type of data your components expect

2. `Object is possibly 'undefined'`
   - TypeScript is warning you that something might not exist
   - Use `?.` to safely access properties: `user?.name` won't break if user is null
   - Use `??` to provide defaults: `value ?? 'default'` means "use value if it exists, otherwise use 'default'"

3. `Property 'x' does not exist on type 'y'`
   - You're trying to use a property that isn't defined in your type
   - Double-check your type definitions
   - Make sure you've imported the right types

### Type Assertions
Sometimes we need to tell TypeScript we know more about a type than it does:

```typescript
// When we know an element is definitely an input
const userInput = event.target as HTMLInputElement;
// This tells TypeScript "trust me, this is an input element"

// When handling JSON data
const data: unknown = JSON.parse(response);
// Start with unknown instead of any - it's safer

// A function to check if something is a User
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&  // Is it an object?
    obj !== null &&            // Is it not null?
    'id' in obj &&            // Does it have an id?
    'email' in obj            // Does it have an email?
  );
}
// This helps TypeScript understand what makes a User a User
```

## Resources
Want to learn more? These are great places to start:
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) - Official guide
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) - Quick reference
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/) - In-depth learning