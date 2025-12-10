// Currency formatting
export const formatCurrency = (amount: number | string, currency = 'IDR'): string => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(num)
}

// Date formatting
export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
    const d = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('id-ID', options || {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(d)
}

// Short date
export const formatDateShort = (date: Date | string): string => {
    return formatDate(date, { day: 'numeric', month: 'short', year: 'numeric' })
}

// Date with time
export const formatDateTime = (date: Date | string): string => {
    return formatDate(date, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

// Relative time (x hari yang lalu)
export const formatRelativeTime = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))

    if (minutes < 1) return 'Baru saja'
    if (minutes < 60) return `${minutes} menit yang lalu`
    if (hours < 24) return `${hours} jam yang lalu`
    if (days < 7) return `${days} hari yang lalu`
    return formatDateShort(d)
}

// Number formatting
export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('id-ID').format(num)
}

// Phone number formatting
export const formatPhone = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.startsWith('62')) {
        return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)}-${cleaned.slice(5, 9)}-${cleaned.slice(9)}`
    }
    if (cleaned.startsWith('0')) {
        return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8)}`
    }
    return phone
}
