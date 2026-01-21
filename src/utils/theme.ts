export const theme = {
    colors: {
        background: '#121212',
        surface: '#1E1E1E',
        surfaceHighlight: '#2C2C2C',
        primary: '#00D1FF', // Cyan-ish for premium tech feel
        secondary: '#8E44AD',
        success: '#00E676',
        error: '#FF5252',
        text: '#FFFFFF',
        textSecondary: '#A0A0A0',
        border: '#333333',
        warning:'yellow',

        // Vault Specific
        stable: '#4CAF50',
        growth: '#2196F3',
        turbo: '#FFC107',
    },
    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
    },
    typography: {
        header: {
            fontSize: 24,
            fontWeight: '700' as const,
            color: '#FFFFFF',
        },
        subHeader: {
            fontSize: 18,
            fontWeight: '600' as const,
            color: '#FFFFFF',
        },
        body: {
            fontSize: 16,
            color: '#A0A0A0',
        },
        caption: {
            fontSize: 12,
            color: '#666666',
        },
    },
    borderRadius: {
        s: 8,
        m: 12,
        l: 16,
    }
};
