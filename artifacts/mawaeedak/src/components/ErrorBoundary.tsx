import React from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage?: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown): State {
    const msg = error instanceof Error ? error.message : String(error);
    return { hasError: true, errorMessage: msg };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false, errorMessage: undefined });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-[100dvh] w-full flex flex-col items-center justify-center px-6 text-center"
          style={{
            background: "linear-gradient(180deg, hsl(34 40% 94%) 0%, hsl(34 30% 89%) 100%)",
            fontFamily: "Tajawal, sans-serif",
            direction: "rtl",
          }}
        >
          <div className="w-20 h-20 rounded-full bg-destructive/10 border-2 border-destructive/20 flex items-center justify-center mb-6">
            <AlertTriangle className="w-9 h-9 text-destructive" />
          </div>

          <h2 className="text-xl font-bold mb-2" style={{ color: "#3D2B1F" }}>
            ط­ط¯ط« ط®ط·ط£ ط؛ظٹط± ظ…طھظˆظ‚ط¹
          </h2>

          <p className="text-sm mb-8 max-w-[280px] leading-relaxed" style={{ color: "#7A5C3A" }}>
            ظ†ط¹طھط°ط± ط¹ظ† ظ‡ط°ط§ ط§ظ„ط®ط·ط£. ظٹظڈط±ط¬ظ‰ ط§ظ„ظ…ط­ط§ظˆظ„ط© ظ…ط±ط© ط£ط®ط±ظ‰ ط£ظˆ ط§ظ„ط¹ظˆط¯ط© ظ„ظ„ط±ط¦ظٹط³ظٹط©.
          </p>

          <div className="flex flex-col gap-3 w-full max-w-[240px]">
            <Button
              className="h-12 rounded-xl font-bold text-base gap-2"
              onClick={this.handleReload}
            >
              <Home className="w-5 h-5" />
              ط§ظ„ط¹ظˆط¯ط© ظ„ظ„ط±ط¦ظٹط³ظٹط©
            </Button>
            <Button
              variant="outline"
              className="h-11 rounded-xl font-bold text-sm gap-2"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4" />
              ط¥ط¹ط§ط¯ط© طھط­ظ…ظٹظ„ ط§ظ„طµظپط­ط©
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

