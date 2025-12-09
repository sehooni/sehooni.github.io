import type { Config } from "tailwindcss";

const config: Config = {
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
                        color: '#333',
                        a: {
                            color: '#3498db',
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        },
                        h1: {
                            fontWeight: '700',
                            borderBottom: '1px solid #e2e2e2',
                            paddingBottom: '0.5rem',
                        },
                        h2: {
                            fontWeight: '700',
                            borderBottom: '1px solid #e2e2e2',
                            paddingBottom: '0.3rem',
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
