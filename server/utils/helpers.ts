import { nanoid } from 'nanoid'

export { nanoid }

// Generate invite token
export const generateInviteToken = (): string => {
    return nanoid(16)
}

// Format currency (IDR)
export const formatCurrency = (amount: number | string, currency = 'IDR'): string => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(num)
}

// Format date
export const formatDate = (date: Date | string, locale = 'id-ID'): string => {
    const d = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(d)
}

// Format date time
export const formatDateTime = (date: Date | string, locale = 'id-ID'): string => {
    const d = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(d)
}

// Slugify string
export const slugify = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
}
