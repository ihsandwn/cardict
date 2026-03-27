import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            colors: {
                surface: '#f9f5ff',
                'surface-low': '#f2efff',
                'surface-high': '#e2dfff',
                'surface-lowest': '#ffffff',
                primary: '#0846ed',
                'primary-container': '#859aff',
                tertiary: '#913983',
                'on-surface': '#2b2a51',
            },
            fontFamily: {
                display: ['"Plus Jakarta Sans"', ...defaultTheme.fontFamily.sans],
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
            borderRadius: {
                xl: '1.5rem',
                lg: '1rem',
            },
            boxShadow: {
                ambient: '0 20px 40px rgba(43, 42, 81, 0.06)',
            },
            spacing: {
                18: '4.5rem',
                22: '5.5rem',
                30: '7rem',
            },
        },
    },

    plugins: [forms],
};
