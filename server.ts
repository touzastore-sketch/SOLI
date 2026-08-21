import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { sendOrderToBothWhatsAppNumbers, getWhatsAppDispatchLogs, WhatsAppOrderPayload } from './server/whatsappService';
import { 
  getCloudinaryClientConfig, 
  uploadMediaToCloudinaryServer, 
  generateCloudinarySignature,
  updateCloudinaryRuntimeConfig,
  testCloudinaryConnection 
} from './server/cloudinaryService';

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn('Could not initialize GoogleGenAI client:', e);
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      store: 'RONY STORE',
      cloudinaryConfigured: Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_UPLOAD_PRESET),
      whatsappConfigured: {
        number1Set: Boolean(process.env.WHATSAPP_NUMBER_1),
        number2Set: Boolean(process.env.WHATSAPP_NUMBER_2),
        cloudApiReady: Boolean(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID)
      }
    });
  });

  // Cloudinary Client Config (Public keys only, no secrets)
  app.get('/api/cloudinary/config', (req, res) => {
    const config = getCloudinaryClientConfig();
    res.json(config);
  });

  // Cloudinary Config Update (Runtime)
  app.post('/api/cloudinary/config', (req, res) => {
    try {
      const { cloudName, apiKey, apiSecret, uploadPreset } = req.body;
      updateCloudinaryRuntimeConfig({ cloudName, apiKey, apiSecret, uploadPreset });
      const config = getCloudinaryClientConfig();
      res.json({ success: true, config });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to update Cloudinary config' });
    }
  });

  // Cloudinary Connection Test
  app.get('/api/cloudinary/test', async (req, res) => {
    try {
      const result = await testCloudinaryConnection();
      res.json(result);
    } catch (err: any) {
      res.json({ success: false, message: err?.message || 'Error testing Cloudinary' });
    }
  });

  // Cloudinary Media Upload Proxy (Server-side authenticated upload)
  app.post('/api/cloudinary/upload', async (req, res) => {
    try {
      const { file, resourceType, folder } = req.body;
      if (!file) {
        return res.status(400).json({ error: 'File data is required' });
      }
      const result = await uploadMediaToCloudinaryServer(file, resourceType || 'auto', folder);
      return res.json({ success: true, result });
    } catch (err: any) {
      console.warn('[Cloudinary Upload Notice]:', err?.message);
      return res.status(400).json({ error: err?.message || 'Failed to upload media to Cloudinary' });
    }
  });

  // Cloudinary Signature generator for direct client uploads
  app.post('/api/cloudinary/sign', (req, res) => {
    try {
      const { paramsToSign } = req.body;
      if (!paramsToSign) {
        return res.status(400).json({ error: 'paramsToSign is required' });
      }
      const signData = generateCloudinarySignature(paramsToSign);
      return res.json(signData);
    } catch (err: any) {
      console.error('[Cloudinary Sign Error]:', err);
      return res.status(500).json({ error: err?.message || 'Failed to generate signature' });
    }
  });

  // Automated WhatsApp Order Notification Endpoint for 2 Numbers
  app.post('/api/send-order-whatsapp', async (req, res) => {
    try {
      const orderPayload: WhatsAppOrderPayload = req.body;

      if (!orderPayload || !orderPayload.orderNumber) {
        return res.status(400).json({ 
          success: false, 
          error: 'Missing order payload or orderNumber' 
        });
      }

      console.log(`[Order API] Received order #${orderPayload.orderNumber} for WhatsApp dispatch.`);
      const dispatchResult = await sendOrderToBothWhatsAppNumbers(orderPayload);

      return res.json({
        success: true,
        orderNumber: orderPayload.orderNumber,
        message: 'WhatsApp notification dispatched to both recipients',
        dispatchResult
      });
    } catch (err: any) {
      console.error('[Order API Error] WhatsApp dispatch exception:', err);
      // Return 200 with soft failure report so customer order is NEVER interrupted
      return res.json({
        success: false,
        error: err?.message || 'Internal dispatch error',
        note: 'Order logged successfully'
      });
    }
  });

  // WhatsApp Dispatch & Retry Queue Logs endpoint
  app.get('/api/whatsapp-logs', (req, res) => {
    const logs = getWhatsAppDispatchLogs();
    res.json({
      success: true,
      total: logs.length,
      logs
    });
  });

  // AI Stylist Assistant endpoint
  app.post('/api/stylist', async (req, res) => {
    try {
      const { message, language } = req.body;
      const isAr = language === 'ar';

      const client = getAIClient();
      if (!client) {
        // Return structured intelligent response if key is not active
        return res.json({
          success: true,
          reply: isAr
            ? 'أهلاً بكِ في روني ستور. نوفر تشكيلة فاخرة من أطقم الحرير الطبيعي والدانتيل، بالإضافة للألعاب الزوجية التفاعلية وأدوات العناية والباديكير مع تغليف سري معتم 100% وشحن لجميع محافظات مصر.'
            : 'Welcome to Rony Store. We offer royal silk intimate sets, couple games, and pedicure spa sets with 100% discreet packaging across Egypt.'
        });
      }

      const prompt = `You are the private AI Concierge and Styling Advisor for "RONY STORE" (بوتيك روني), a high-end luxury Egyptian intimate boutique.
You specialize in:
1. Luxury silk and lace lingerie, robes, bodysuits, and nightwear.
2. Couple games, intimacy romance boxes, and connection cards.
3. Pedicure spa sets, botanical massage candles, and silky skincare.
4. Explaining size guide with discretion (Egyptian sizing S: 45-55kg, M: 55-65kg, L: 65-75kg, XL: 75-85kg).
5. Reassuring customers about 100% discreet packaging (plain unmarked box, no store name on external courier label, private dispatch across all Egyptian governorates).

Customer asked in ${isAr ? 'Arabic' : 'English'}: "${message}"
Respond with polite, elegant, warm, sophisticated, respectful luxury advisor tone in ${isAr ? 'Arabic' : 'English'}. Keep response concise (under 80 words).`;

      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return res.json({
        success: true,
        reply: response.text || ''
      });
    } catch (err: any) {
      console.error('Error in /api/stylist:', err);
      return res.status(500).json({ error: 'Failed to generate styling advice' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Rony Store server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
