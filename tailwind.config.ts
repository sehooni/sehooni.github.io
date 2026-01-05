import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'media',
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    "-apple-system",
                    "BlinkMacSystemFont",
                    "Roboto",
                    "Segoe UI",
                    "Helvetica Neue",
                    "Lucida Grande",
                    "Arial",
                    "sans-serif",
                ],
                serif: ["Georgia", "Times", "Times New Roman", "serif"],
                mono: ["Menlo", "Monaco", "Consolas", "Courier New", "monospace"],
            },

            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: '100%',
                        color: 'var(--foreground)',
                        a: {
                            color: 'var(--primary)',
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        },
                        h1: {
                            fontWeight: '700',
                            borderBottom: '1px solid var(--border)',
                            paddingBottom: '0.5rem',
                            color: 'var(--foreground)',
                        },
                        h2: {
                            fontWeight: '700',
                            borderBottom: '1px solid var(--border)',
                            paddingBottom: '0.3rem',
                            color: 'var(--foreground)',
                        },

                        'code::before': {
                            content: '""',
                        },
                        'code::after': {
                            content: '""',
                        },
                    },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
export default config;
