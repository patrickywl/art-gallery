"use client";

import { Component, type ReactNode } from "react";
import { datadogRum } from "@datadog/browser-rum";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class RumErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    datadogRum.addError(error, { source: "react_error_boundary" });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="mt-2 text-sm text-zinc-500">
            This error has been automatically reported.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-zinc-900"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
