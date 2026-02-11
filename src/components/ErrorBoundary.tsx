import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("App error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          dir="rtl"
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            fontFamily: "Assistant, sans-serif",
            textAlign: "center",
            background: "#fafafa",
            color: "#333",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
            אירעה שגיאה
          </h1>
          <p style={{ marginBottom: "1rem", opacity: 0.8 }}>
            נסה לרענן את הדף. אם הבעיה נמשכת, בדוק את הקונסול.
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              cursor: "pointer",
              border: "1px solid #ccc",
              borderRadius: "6px",
              background: "#fff",
            }}
          >
            נסה שוב
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
