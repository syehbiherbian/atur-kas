export interface WaGatewayConfig {
    provider: string
    apiKey: string
    senderNumber?: string
}

export interface WaSendResult {
    success: boolean
    messageId?: string
    error?: string
}

// WhatsApp gateway abstraction
export const sendWhatsAppMessage = async (
    config: WaGatewayConfig,
    phone: string,
    message: string
): Promise<WaSendResult> => {
    try {
        // Normalize phone number (add country code if needed)
        let normalizedPhone = phone.replace(/\D/g, '')
        if (normalizedPhone.startsWith('0')) {
            normalizedPhone = '62' + normalizedPhone.substring(1)
        }

        // Provider implementations
        if (config.provider === 'fonnte') {
            const response = await fetch('https://api.fonnte.com/send', {
                method: 'POST',
                headers: {
                    'Authorization': config.apiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    target: normalizedPhone,
                    message: message,
                }),
            })

            const result = await response.json()

            if (result.status) {
                return { success: true, messageId: result.id }
            } else {
                return { success: false, error: result.reason || 'Unknown error' }
            }
        }

        // Add more providers here (Twilio, Wablas, etc.)

        return { success: false, error: 'Provider not supported' }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

// Template placeholder replacement
export const processTemplate = (
    template: string,
    data: Record<string, string>
): string => {
    let result = template
    for (const [key, value] of Object.entries(data)) {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), value)
    }
    return result
}
