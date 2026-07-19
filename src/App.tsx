// src/App.tsx
import { AuthProvider } from "@/context/AuthContext";
import { AppRouter } from "@/app/router"; // Or whatever file exports your router

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}