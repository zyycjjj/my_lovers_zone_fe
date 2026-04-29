"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "./ui";

type Props = {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[300px] items-center justify-center bg-[#FAFAFA] px-4">
          <div className="max-w-[420px] text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FEF2F2] text-xl">
              ⚠
            </div>
            <h2 className="mt-4 text-lg font-semibold text-[#27272A]">
              {this.props.fallbackTitle || "页面出了点问题"}
            </h2>
            <p className="mt-2 text-sm leading-7 text-[#737378]">
              {this.props.fallbackDescription ||
                "这个区域暂时无法正常显示，你可以尝试刷新页面或返回重试。"}
            </p>
            <p className="mt-1 max-w-[360px] mx-auto text-xs text-[#A3A3AD] break-all">
              {this.state.error?.message || ""}
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Button
                className="rounded-[14px] px-5"
                onClick={() => window.location.reload()}
                variant="primary"
              >
                刷新页面
              </Button>
              <Button
                className="rounded-[14px] px-5"
                onClick={() => this.setState({ hasError: false, error: null })}
                variant="secondary"
              >
                重试
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
