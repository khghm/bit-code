import ReactDOM from 'react-dom/client';
import './index.css';

const el = document.getElementById('root');
if (!el) throw new Error('root element missing');
const root = ReactDOM.createRoot(el);

import('./App')
  .then(({ default: App }) => {
    root.render(<App />);
  })
  .catch((err: unknown) => {
    console.error('خطای بارگذاری اپ:', err);
    root.render(
      <div
        dir="rtl"
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#050d16',
          color: '#e9f1fa',
          fontFamily: 'Vazirmatn, sans-serif',
          padding: 16,
        }}
      >
        <div style={{ maxWidth: 480, width: '100%', border: '1px solid rgba(255,122,99,0.4)', background: 'rgba(7,20,34,0.9)', borderRadius: 8, padding: 32, textAlign: 'center' }}>
          <p style={{ fontSize: 40, margin: 0 }}>⚠️</p>
          <h1 style={{ fontSize: 26, margin: '12px 0 0', lineHeight: 1.6 }}>در بارگذاری بیت‌کد مشکلی پیش آمد</h1>
          <p style={{ color: '#9db4c9', fontSize: 14, lineHeight: 2, marginTop: 12 }}>
            معمولاً با یک بارگذاری دوباره حل می‌شود. اگر ادامه داشت، کش مرورگر را پاک کن.
          </p>
          <p dir="ltr" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#64809c', border: '1px solid rgba(124,178,232,0.14)', borderRadius: 6, padding: 10, marginTop: 16, textAlign: 'left', wordBreak: 'break-word' }}>
            {String(err instanceof Error ? err.message : err)}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 24,
              background: '#ffb454',
              color: '#071422',
              fontWeight: 700,
              border: 'none',
              borderRadius: 6,
              padding: '12px 36px',
              fontSize: 15,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            بارگذاری دوباره
          </button>
        </div>
      </div>
    );
  });
