import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('خطای اجرا:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div dir="rtl" className="min-h-screen grid place-items-center bg-night-950 text-mist font-body px-4">
          <div className="max-w-lg w-full border border-coral/40 bg-night-900/80 rounded-md p-8 text-center">
            <p className="font-display text-5xl text-coral">⚠</p>
            <h1 className="font-display text-3xl mt-4">یک خطای غیرمنتظره رخ داد</h1>
            <p className="text-dim text-sm leading-7 mt-3">
              نگران نباش؛ داده‌های پیشرفتت سالم است. صفحه را دوباره بارگذاری کن؛ اگر مشکل ادامه داشت، کش مرورگر را پاک کن.
            </p>
            <p className="font-code text-[11px] text-faint mt-4 border border-linec rounded p-3 text-left" dir="ltr">
              {String(this.state.error.message || this.state.error)}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 bg-amber text-night-900 font-bold rounded-md px-8 py-3 hover:bg-[#ffc775] transition-colors"
            >
              بارگذاری دوباره
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
