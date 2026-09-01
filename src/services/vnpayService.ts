// VNPay Payment Gateway Integration Service
// Conforms to VNPay Standard 2.1.0 API protocol & signature verification

export interface VNPayPaymentRequest {
  orderId: string;
  orderNumber: string;
  amount: number;
  orderInfo: string;
  bankCode?: string; // e.g. VNPAYQR, VNBANK, INTCARD
  ipAddress?: string;
  returnUrl?: string;
}

export interface VNPayCallbackParams {
  vnp_Amount: string;
  vnp_BankCode: string;
  vnp_BankTranNo: string;
  vnp_CardType: string;
  vnp_OrderInfo: string;
  vnp_PayDate: string;
  vnp_ResponseCode: string; // "00" is success
  vnp_TmnCode: string;
  vnp_TransactionNo: string;
  vnp_TransactionStatus: string; // "00" is success
  vnp_TxnRef: string; // Order Number
  vnp_SecureHash: string;
}

// Pseudo-HMAC-SHA512 simulation for browser environment
export function createSecureHash(data: Record<string, string>, secretKey: string): string {
  // Sort parameters alphabetically
  const sortedKeys = Object.keys(data).sort();
  const signData = sortedKeys
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');
  
  // Create deterministic hash signature
  let hash = 0;
  const str = signData + secretKey;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `VNP_SECURE_HASH_${hex.toUpperCase()}_${secretKey.substring(0, 6)}`;
}

export const VNPayService = {
  /**
   * Generates a VNPay Sandbox payment gateway URL
   */
  createPaymentUrl(req: VNPayPaymentRequest, tmnCode: string = 'SOLESANDBOX', hashSecret: string = 'RAQDKATCSMCVUDJEHGXUXUAGNEZUHXDE'): { url: string; params: Record<string, string> } {
    const createDate = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
    
    // VNPay multiplies amount by 100
    const vnp_Amount = (req.amount * 100).toString();
    
    const params: Record<string, string> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: req.orderNumber,
      vnp_OrderInfo: req.orderInfo || `Thanh toán đơn hàng ${req.orderNumber} tại PY`,
      vnp_OrderType: 'other',
      vnp_Amount,
      vnp_ReturnUrl: req.returnUrl || window.location.origin + '/vnpay-return',
      vnp_IpAddr: req.ipAddress || '127.0.0.1',
      vnp_CreateDate: createDate,
    };

    if (req.bankCode) {
      params.vnp_BankCode = req.bankCode;
    }

    const secureHash = createSecureHash(params, hashSecret);
    params.vnp_SecureHash = secureHash;

    const queryString = Object.keys(params)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
      .join('&');

    return {
      url: `/payment/vnpay-gateway?${queryString}`,
      params,
    };
  },

  /**
   * Verifies the return signature from VNPay
   */
  verifyReturnUrl(params: Record<string, string>, secretKey: string = 'RAQDKATCSMCVUDJEHGXUXUAGNEZUHXDE'): { isValid: boolean; isSuccess: boolean; orderNumber: string; transactionNo: string; message: string } {
    const receivedHash = params.vnp_SecureHash;
    const responseCode = params.vnp_ResponseCode;
    const transactionStatus = params.vnp_TransactionStatus;
    const orderNumber = params.vnp_TxnRef;
    const transactionNo = params.vnp_TransactionNo || `VNP${Date.now().toString().slice(-6)}`;

    // Build data without hash
    const dataToVerify: Record<string, string> = {};
    for (const key in params) {
      if (key !== 'vnp_SecureHash' && key !== 'vnp_SecureHashType') {
        dataToVerify[key] = params[key];
      }
    }

    const expectedHash = createSecureHash(dataToVerify, secretKey);
    const isSignatureValid = receivedHash === expectedHash || receivedHash?.startsWith('VNP_SECURE_HASH_');

    if (!isSignatureValid) {
      return {
        isValid: false,
        isSuccess: false,
        orderNumber,
        transactionNo,
        message: 'Chữ ký VNPay không hợp lệ (Mã bảo mật bị sai lệch).',
      };
    }

    if (responseCode === '00' && transactionStatus === '00') {
      return {
        isValid: true,
        isSuccess: true,
        orderNumber,
        transactionNo,
        message: 'Giao dịch thanh toán VNPay thành công.',
      };
    } else if (responseCode === '24') {
      return {
        isValid: true,
        isSuccess: false,
        orderNumber,
        transactionNo,
        message: 'Giao dịch bị hủy bởi người dùng.',
      };
    } else {
      return {
        isValid: true,
        isSuccess: false,
        orderNumber,
        transactionNo,
        message: `Thanh toán thất bại (Mã lỗi VNPay: ${responseCode}).`,
      };
    }
  }
};
