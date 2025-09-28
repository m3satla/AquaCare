
import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { reloadTranslations } from "../../backend/services/translationService";

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("❌ React Error:", error);
    console.error("❌ Error Info:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" style={{ padding: 20, textAlign: "center" }}>
          <h1>🚨 Something went wrong!</h1>
          <p>Error: {this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  useEffect(() => {
    // Force reload translations on app start to ensure we have the latest translations
    const loadTranslations = async () => {
      try {
        await reloadTranslations();
      } catch (error) {
        console.error("Failed to reload translations:", error);
      }
    };
    
    loadTranslations();
  }, []);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;
