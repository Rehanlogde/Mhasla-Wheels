// // src/context/AuthContext.tsx
// import { createContext, useContext, useEffect, useState } from "react";
// import { createClient, User } from "@supabase/supabase-js";

// // ✅ Supabase client (frontend uses anon key)
// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL!,
//   import.meta.env.VITE_SUPABASE_ANON_KEY!
// );

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   login: (email: string, password: string) => Promise<{ error?: string }>;
//   register: (
//     email: string,
//     password: string,
//     name: string,
//     metadata?: { phone?: string }
//   ) => Promise<{ error?: string }>;
//   logout: () => Promise<void>;
//   refreshUser: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   // ✅ Initialize session once on mount
//   useEffect(() => {
//     let mounted = true;

//     const initSession = async () => {
//       const { data } = await supabase.auth.getSession();
//       if (mounted) {
//         setUser(data.session?.user || null);
//         setLoading(false);
//       }
//     };

//     initSession();

//     // ✅ Listen for changes
//     const { data: listener } = supabase.auth.onAuthStateChange(
//       (_event, session) => {
//         setUser(session?.user || null);
//       }
//     );

//     return () => {
//       mounted = false;
//       listener.subscription.unsubscribe();
//     };
//   }, []);

//   // ✅ Login
//   const login = async (email: string, password: string) => {
//     const { error } = await supabase.auth.signInWithPassword({ email, password });
//     return error ? { error: error.message } : {};
//   };

//   // ✅ Register (with name + phone metadata)
//   const register = async (
//     email: string,
//     password: string,
//     name: string,
//     metadata?: { phone?: string }
//   ) => {
//     const { error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: {
//           name,
//           phone: metadata?.phone || "",
//         },
//       },
//     });
//     return error ? { error: error.message } : {};
//   };

//   // ✅ Logout
//   const logout = async () => {
//     await supabase.auth.signOut();
//     setUser(null);
//   };

//   // ✅ Refresh user (useful after profile update)
//   const refreshUser = async () => {
//     const { data } = await supabase.auth.getUser();
//     if (data.user) setUser(data.user);
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, loading, login, register, logout, refreshUser }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Hook
// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// };


// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface AuthContextType {
  customer: Customer | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (
    name: string,
    email: string,
    password: string,
    phone?: string
  ) => Promise<{ error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("CUSTOMER_TOKEN");
    const storedCustomer = localStorage.getItem("CUSTOMER_DATA");

    if (storedToken && storedCustomer) {
      try {
        setToken(storedToken);
        setCustomer(JSON.parse(storedCustomer));
      } catch {
        // Invalid stored data, clear it
        localStorage.removeItem("CUSTOMER_TOKEN");
        localStorage.removeItem("CUSTOMER_DATA");
      }
    }
    setLoading(false);
  }, []);

  // Customer login
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/functions/customer-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        return { error: json.error || "Login failed" };
      }

      // Store token and customer data
      localStorage.setItem("CUSTOMER_TOKEN", json.token);
      localStorage.setItem("CUSTOMER_DATA", JSON.stringify(json.customer));
      setToken(json.token);
      setCustomer(json.customer);

      return {};
    } catch (err: any) {
      return { error: err.message || "Network error" };
    } 
  };

  // Customer register
  const register = async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ) => {
    try {
      const res = await fetch("/api/functions/customer-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        return { error: json.error || "Registration failed" };
      }

      return {};
    } catch (err: any) {
      return { error: err.message || "Network error" };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("CUSTOMER_TOKEN");
    localStorage.removeItem("CUSTOMER_DATA");
    setToken(null);
    setCustomer(null);
  };

  // Refresh user (placeholder - can be extended to verify token with backend)
  const refreshUser = async () => {
    // For now, just re-read from localStorage
    const storedCustomer = localStorage.getItem("CUSTOMER_DATA");
    if (storedCustomer) {
      try {
        setCustomer(JSON.parse(storedCustomer));
      } catch {
        // ignore
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{ customer, token, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

