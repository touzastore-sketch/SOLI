export interface WhatsAppOrderItem {
  name: string;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
}

export interface WhatsAppOrderPayload {
  orderNumber: string;
  date?: string;
  customer: {
    fullName: string;
    phone: string;
    email?: string;
  };
  address: {
    governorate: string;
    city: string;
    street: string;
    landmark?: string;
  };
  items: WhatsAppOrderItem[];
  subtotal: number;
  discount?: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
  isDiscreetPackaging?: boolean;
  notes?: string;
}

export interface WhatsAppDispatchLog {
  id: string;
  timestamp: string;
  orderNumber: string;
  recipient: string;
  status: 'success' | 'failed' | 'retrying' | 'success_on_retry' | 'failed_after_retry' | 'sandbox_unregistered';
  attemptCount: number;
  messageId?: string;
  error?: string;
  guidance?: string;
  directUrl: string;
}

/**
 * ==============================================================================
 * CENTRALIZED WHATSAPP RECIPIENTS CONFIGURATION (إعداد أرقام الاستقبال المركزية)
 * ==============================================================================
 * Define the order notification recipient numbers in international format (without +).
 * Can be configured via environment variables WHATSAPP_NUMBER_1 & WHATSAPP_NUMBER_2,
 * or using default store reception lines.
 */
export const WHATSAPP_ORDER_RECIPIENTS: string[] = [
  process.env.WHATSAPP_NUMBER_1 || '201002108272',
  process.env.WHATSAPP_NUMBER_2 || '201095461883'
];

// In-memory circular log store for recent order dispatches
const dispatchLogs: WhatsAppDispatchLog[] = [];
const MAX_LOGS = 100;

export function getWhatsAppDispatchLogs(): WhatsAppDispatchLog[] {
  return [...dispatchLogs];
}

function recordLog(log: WhatsAppDispatchLog) {
  const existingIdx = dispatchLogs.findIndex(l => l.id === log.id);
  if (existingIdx >= 0) {
    dispatchLogs[existingIdx] = log;
  } else {
    dispatchLogs.unshift(log);
    if (dispatchLogs.length > MAX_LOGS) {
      dispatchLogs.pop();
    }
  }
}

/**
 * Standardize telephone numbers to E.164 without leading plus
 * e.g., '01002108272' -> '201002108272'
 */
export function formatWhatsAppRecipientNumber(rawNumber: string): string {
  if (!rawNumber) return '';
  let cleaned = String(rawNumber).replace(/[^\d+]/g, '').trim();
  
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }
  if (cleaned.startsWith('00')) {
    cleaned = cleaned.substring(2);
  }
  // Egyptian local numbers starting with 01 (11 digits)
  if (cleaned.startsWith('01') && cleaned.length === 11) {
    cleaned = '2' + cleaned;
  }
  
  return cleaned;
}

/**
 * Format complete, clean text message with zero undefined fields
 */
export function buildWhatsAppOrderMessage(data: WhatsAppOrderPayload): string {
  const orderNumber = data.orderNumber || `RONY-${Date.now().toString().slice(-4)}`;
  const orderDate = data.date || new Date().toISOString().split('T')[0];
  
  const customerName = (data.customer?.fullName || 'عميل روني').trim();
  const customerPhone = (data.customer?.phone || 'غير محدد').trim();
  const customerEmail = data.customer?.email?.trim() || '';

  // Clean Address components
  const gov = (data.address?.governorate || '').trim();
  const city = (data.address?.city || '').trim();
  const street = (data.address?.street || '').trim();
  const landmark = (data.address?.landmark || '').trim();

  const addressParts = [gov, city, street].filter(Boolean);
  let addressText = addressParts.join(' - ') || 'العنوان المسجل بالطلب';
  if (landmark) {
    addressText += ` (علامة مميزة: ${landmark})`;
  }

  // Items list
  let itemsText = '- لا توجد منتجات محددة';
  if (Array.isArray(data.items) && data.items.length > 0) {
    itemsText = data.items.map((item, idx) => {
      const name = (item.name || `منتج ${idx + 1}`).trim();
      const qty = Number(item.quantity) || 1;
      const price = Number(item.price) || 0;
      const itemTotal = (qty * price).toLocaleString();

      const specs = [item.color?.trim(), item.size?.trim()].filter(Boolean).join(' / ');
      const specsPart = specs ? ` (${specs})` : '';

      return `${idx + 1}. ${name}${specsPart}\n   الكمية: ${qty} × ${price.toLocaleString()} جنيه = ${itemTotal} جنيه`;
    }).join('\n');
  }

  // Financials
  const subtotalVal = Number(data.subtotal) || 0;
  const discountVal = Number(data.discount) || 0;
  const shippingVal = Number(data.shippingFee) || 0;
  const totalVal = Number(data.total) || (subtotalVal - discountVal + shippingVal);

  const discountLine = discountVal > 0 ? `\n- الخصم: -${discountVal.toLocaleString()} جنيه` : '';
  const shippingLine = shippingVal === 0 
    ? '- الشحن: مجاني (0 جنيه)' 
    : `- الشحن: ${shippingVal.toLocaleString()} جنيه`;

  // Payment & Notes
  const paymentMethod = (data.paymentMethod || 'الدفع عند الاستلام (Cash on Delivery)').trim();
  
  let notesSection = '';
  const userNotes = (data.notes || '').trim();
  if (userNotes) {
    notesSection = `\n\n*ملاحظات العميل:*\n- ${userNotes}`;
  } else if (data.isDiscreetPackaging) {
    notesSection = `\n\n*ملاحظات:*\n- تغليف سري معتم 100%`;
  }

  return `*طلب جديد - متجر روني (RONY STORE)*
----------------------------------------
*رقم الطلب:* #${orderNumber}
*تاريخ الطلب:* ${orderDate}

*بيانات العميل:*
- الاسم: ${customerName}
- الهاتف: ${customerPhone}${customerEmail ? `\n- البريد: ${customerEmail}` : ''}

*عنوان التوصيل:*
- ${addressText}

*المنتجات المطلوبة:*
${itemsText}

*الحساب الإجمالي:*
- المجموع الفرعي: ${subtotalVal.toLocaleString()} جنيه${discountLine}
${shippingLine}
- الإجمالي الكلي: ${totalVal.toLocaleString()} جنيه

*طريقة الدفع:*
- ${paymentMethod}${notesSection}
----------------------------------------
*تم الإرسال عبر متجر روني الإلكتروني*`;
}

/**
 * Universal WhatsApp link builder
 */
export function createWhatsAppDirectUrl(phone: string, text: string): string {
  const formatted = formatWhatsAppRecipientNumber(phone);
  return `https://api.whatsapp.com/send?phone=${encodeURIComponent(formatted)}&text=${encodeURIComponent(text)}`;
}

/**
 * Send a single WhatsApp POST request via WhatsApp Business Cloud API v21.0
 */
async function sendSingleWhatsAppPost(
  recipient: string,
  messageBody: string,
  phoneNumberId: string,
  accessToken: string
): Promise<{ success: boolean; messageId?: string; error?: string; errorCode?: number; guidance?: string }> {
  const formattedPhone = formatWhatsAppRecipientNumber(recipient);
  
  if (!formattedPhone) {
    return { success: false, error: `Invalid recipient phone number: ${recipient}` };
  }

  // Target endpoint: https://graph.facebook.com/v21.0/{WHATSAPP_PHONE_NUMBER_ID}/messages
  const endpoint = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: formattedPhone,
        type: 'text',
        text: {
          preview_url: false,
          body: messageBody
        }
      })
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = responseData?.error?.message || `HTTP ${response.status}`;
      const errorCode = responseData?.error?.code || response.status;
      
      let guidance = '';
      if (errorCode === 131030) {
        guidance = 'Meta Sandbox Mode: Add recipient number to "To" allowed list in Meta Developer Portal (WhatsApp -> API Setup) or switch to Live Mode.';
      } else if (errorCode === 190) {
        guidance = 'Meta Access Token is expired. Generate a permanent System User token.';
      }

      return {
        success: false,
        errorCode,
        error: errorMsg,
        guidance
      };
    }

    const messageId = responseData?.messages?.[0]?.id || `msg_${Date.now()}`;
    return { success: true, messageId };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network exception'
    };
  }
}

/**
 * Schedule an automatic 1-minute retry for transient failures
 */
function scheduleAutoRetry(
  logId: string,
  recipient: string,
  orderNumber: string,
  messageBody: string,
  phoneNumberId: string,
  accessToken: string,
  directUrl: string
) {
  setTimeout(async () => {
    try {
      const retryResult = await sendSingleWhatsAppPost(recipient, messageBody, phoneNumberId, accessToken);
      
      if (retryResult.success) {
        recordLog({
          id: logId,
          timestamp: new Date().toISOString(),
          orderNumber,
          recipient,
          status: 'success_on_retry',
          attemptCount: 2,
          messageId: retryResult.messageId,
          directUrl
        });
      } else {
        recordLog({
          id: logId,
          timestamp: new Date().toISOString(),
          orderNumber,
          recipient,
          status: 'failed_after_retry',
          attemptCount: 2,
          error: retryResult.error,
          guidance: retryResult.guidance,
          directUrl
        });
      }
    } catch {
      // Handled cleanly
    }
  }, 60000);
}

/**
 * Send order notification to all configured recipients (WHATSAPP_ORDER_RECIPIENTS) concurrently
 */
export async function sendOrderToBothWhatsAppNumbers(orderPayload: WhatsAppOrderPayload): Promise<{
  success: boolean;
  orderNumber: string;
  messageText: string;
  dispatchedAt: string;
  recipients: string[];
  directLinks: { number1: string; number2: string };
  results: Array<{
    recipient: string;
    status: 'success' | 'failed' | 'simulated' | 'sandbox_unregistered';
    messageId?: string;
    error?: string;
    guidance?: string;
    directUrl: string;
  }>;
}> {
  const messageText = buildWhatsAppOrderMessage(orderPayload);
  const orderNumber = orderPayload.orderNumber || 'UNKNOWN';

  // Extract recipients list from centralized configuration
  const formattedRecipients = WHATSAPP_ORDER_RECIPIENTS.map(formatWhatsAppRecipientNumber).filter(Boolean);
  const recipient1 = formattedRecipients[0] || '201002108272';
  const recipient2 = formattedRecipients[1] || '201095461883';

  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
  
  /**
   * IMPORTANT FOR PRODUCTION DEPLOYMENT:
   * WHATSAPP_ACCESS_TOKEN currently uses a 24-hour Temporary Access Token from Meta Developer Portal.
   * BEFORE launching the store in live production, you MUST replace this with a Permanent System User Token
   * generated from Meta Business Manager:
   * 1. Go to Meta Business Suite -> Settings -> Business Settings -> System Users.
   * 2. Create / Select System User with Admin role.
   * 3. Click 'Generate New Token' -> select your WhatsApp App -> check 'whatsapp_business_messaging' and 'whatsapp_business_management'.
   * 4. Set token expiration to 'Never' (Permanent Token) and set it in your environment variable WHATSAPP_ACCESS_TOKEN.
   * This guarantees 24/7 uninterrupted automated order notifications for your store.
   */
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';

  const directLinks = {
    number1: createWhatsAppDirectUrl(recipient1, messageText),
    number2: createWhatsAppDirectUrl(recipient2, messageText)
  };

  // If credentials are not set in environment, handle in simulation mode
  if (!phoneNumberId || !accessToken) {
    const simulatedResults = formattedRecipients.map((recip, idx) => ({
      recipient: recip,
      status: 'simulated' as const,
      messageId: `sim_${idx + 1}_${Date.now()}`,
      directUrl: idx === 0 ? directLinks.number1 : directLinks.number2
    }));

    simulatedResults.forEach(r => {
      recordLog({
        id: `log_${orderNumber}_${r.recipient}_1`,
        timestamp: new Date().toISOString(),
        orderNumber,
        recipient: r.recipient,
        status: 'success',
        attemptCount: 1,
        messageId: r.messageId,
        directUrl: r.directUrl
      });
    });

    return {
      success: true,
      orderNumber,
      messageText,
      dispatchedAt: new Date().toISOString(),
      recipients: formattedRecipients,
      directLinks,
      results: simulatedResults
    };
  }

  // Execute independent POST requests for each recipient concurrently via Promise.allSettled
  const dispatchPromises = formattedRecipients.map(recipient => 
    sendSingleWhatsAppPost(recipient, messageText, phoneNumberId, accessToken)
  );

  const settleResults = await Promise.allSettled(dispatchPromises);

  const outputResults: Array<{
    recipient: string;
    status: 'success' | 'failed' | 'simulated' | 'sandbox_unregistered';
    messageId?: string;
    error?: string;
    guidance?: string;
    directUrl: string;
  }> = [];

  settleResults.forEach((res, index) => {
    const recipient = formattedRecipients[index];
    const logId = `log_${orderNumber}_${recipient}_${Date.now()}`;
    const directUrl = index === 0 ? directLinks.number1 : directLinks.number2;

    if (res.status === 'fulfilled' && res.value.success) {
      recordLog({
        id: logId,
        timestamp: new Date().toISOString(),
        orderNumber,
        recipient,
        status: 'success',
        attemptCount: 1,
        messageId: res.value.messageId,
        directUrl
      });
      outputResults.push({
        recipient,
        status: 'success',
        messageId: res.value.messageId,
        directUrl
      });
    } else {
      const val = res.status === 'fulfilled' ? res.value : { error: res.reason?.message, errorCode: 0, guidance: '' };
      const isSandboxRestriction = val.errorCode === 131030;
      const statusType = isSandboxRestriction ? 'sandbox_unregistered' : 'retrying';

      recordLog({
        id: logId,
        timestamp: new Date().toISOString(),
        orderNumber,
        recipient,
        status: statusType,
        attemptCount: 1,
        error: val.error,
        guidance: val.guidance,
        directUrl
      });

      outputResults.push({
        recipient,
        status: isSandboxRestriction ? 'sandbox_unregistered' : 'failed',
        error: val.error,
        guidance: val.guidance,
        directUrl
      });

      if (!isSandboxRestriction) {
        scheduleAutoRetry(logId, recipient, orderNumber, messageText, phoneNumberId, accessToken, directUrl);
      }
    }
  });

  return {
    success: true, // Non-blocking: order creation in database and UI is always preserved
    orderNumber,
    messageText,
    dispatchedAt: new Date().toISOString(),
    recipients: formattedRecipients,
    directLinks,
    results: outputResults
  };
}
