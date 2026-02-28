/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html",
    ],
    theme: {
        extend: {
            fontFamily: {
                'grotesk': ['"Space Grotesk"', 'sans-serif'],
                'inter': ['"Inter"', 'sans-serif'],
                'mono': ['"JetBrains Mono"', 'monospace'],
            },
            colors: {
                brand: {
                    bg: '#0A0F1E',
                    card: '#111827',
                    border: '#1E293B',
                },
                accent: {
                    blue: '#38BDF8',
                    indigo: '#6366F1',
                    green: '#10B981',
                    amber: '#F59E0B',
                    red: '#EF4444',
                    pink: '#EC4899',
                    purple: '#8B5CF6',
                },
            },
            keyframes: {
                pulseGlow: {
                    '0%': { boxShadow: '0 0 0 0 rgba(56,189,248,0.4)' },
                    '70%': { boxShadow: '0 0 0 12px rgba(56,189,248,0)' },
                    '100%': { boxShadow: '0 0 0 0 rgba(56,189,248,0)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                spin: {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
            },
            animation: {
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'slide-up': 'slideUp 0.4s ease-out forwards',
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'shimmer': 'shimmer 2s linear infinite',
                'spin-slow': 'spin 1s linear infinite',
            },
        },
    },
    plugins: [],
};
