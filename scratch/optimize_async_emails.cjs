const fs = require('fs');
const path = require('path');

const backendDir = 'd:/Bright Media WORK/siddiqui-backend/server';
const apiLibDir = 'd:/Bright Media WORK/Siddiui.digital-main/Siddiui.digital-main/api/_lib';

function patchFile(filePath, transforms) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  for (const { from, to } of transforms) {
    if (content.includes(from)) {
      content = content.replace(from, to);
      console.log(`Patched in ${filePath}`);
    } else {
      console.log(`Pattern not found or already patched in ${filePath}`);
    }
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

// 1. customerAuth.js
const customerAuthPatch = [
  {
    from: `        await sendSetPasswordEmail({
          to: cleanEmail,
          customerName: name,
          setPasswordLink: linkData.properties.action_link,
          editionType,
        });`,
    to: `        sendSetPasswordEmail({
          to: cleanEmail,
          customerName: name,
          setPasswordLink: linkData.properties.action_link,
          editionType,
        }).catch(e => console.warn("[ensureCustomerAccount] Set password email notice:", e.message));`
  }
];

patchFile(path.join(backendDir, 'utils/customerAuth.js'), customerAuthPatch);

// 2. payhipController.js
const payhipControllerPatch = [
  {
    from: `        try {
          if (buyerEmail) {
            await sendOrderConfirmationEmail({
              to: buyerEmail,
              customerName: item.customer_name || "Valued Reader",
              orderNumber,
              productName: mapping.title,
              amount: totalAmount,
              currency,
              downloadUrl,
              editionType: mapping.editionType,
              expiryHours,
              downloadLimit: isOnline ? 0 : 3,
            });
          }
        } catch (emailErr) {
          console.warn("[payhipWebhook] Email delivery notice:", emailErr.message);
        }`,
    to: `        if (buyerEmail) {
          sendOrderConfirmationEmail({
            to: buyerEmail,
            customerName: item.customer_name || "Valued Reader",
            orderNumber,
            productName: mapping.title,
            amount: totalAmount,
            currency,
            downloadUrl,
            editionType: mapping.editionType,
            expiryHours,
            downloadLimit: isOnline ? 0 : 3,
          }).catch(emailErr => console.warn("[payhipWebhook] Email delivery notice:", emailErr.message));
        }`
  }
];

patchFile(path.join(backendDir, 'controllers/payhipController.js'), payhipControllerPatch);
if (fs.existsSync(apiLibDir)) {
  patchFile(path.join(apiLibDir, 'payhipController.js'), payhipControllerPatch);
}

// 3. paypalController.js
const paypalControllerPatch = [
  {
    from: `    try {
      if (customerEmail) {
        await sendOrderConfirmationEmail({
          to: customerEmail,
          customerName,
          orderNumber: existingOrder?.order_number || \`ORD-\${targetPayPalOrderId.substring(0, 8).toUpperCase()}\`,
          productName: existingOrder?.book_name || "Marketing Reclassified",
          amount: capturedAmount.toFixed(2),
          currency: capturedCurrency,
          downloadUrl,
          editionType: detectedEdition,
          expiryHours,
          downloadLimit: detectedEdition === "online" ? 0 : 3,
        });
      }
    } catch (emailErr) {
      console.warn("[capturePayPalOrder] Confirmation email delivery notice:", emailErr.message);
    }`,
    to: `    if (customerEmail) {
      sendOrderConfirmationEmail({
        to: customerEmail,
        customerName,
        orderNumber: existingOrder?.order_number || \`ORD-\${targetPayPalOrderId.substring(0, 8).toUpperCase()}\`,
        productName: existingOrder?.book_name || "Marketing Reclassified",
        amount: capturedAmount.toFixed(2),
        currency: capturedCurrency,
        downloadUrl,
        editionType: detectedEdition,
        expiryHours,
        downloadLimit: detectedEdition === "online" ? 0 : 3,
      }).catch(emailErr => console.warn("[capturePayPalOrder] Confirmation email delivery notice:", emailErr.message));
    }`
  },
  {
    from: `      try {
        if (customerEmail) {
          await sendOrderConfirmationEmail({
            to: customerEmail,
            customerName,
            orderNumber: existingOrder?.order_number || \`ORD-\${captureId.substring(0, 8).toUpperCase()}\`,
            productName: existingOrder?.book_name || "Marketing Reclassified",
            amount: capturedAmount.toFixed(2),
            currency: capturedCurrency,
            downloadUrl,
            editionType: detectedEdition,
            expiryHours,
            downloadLimit: detectedEdition === "online" ? 0 : 3,
          });
        }
      } catch (emailErr) {
        console.warn("[paypalWebhook] Confirmation email delivery notice:", emailErr.message);
      }`,
    to: `      if (customerEmail) {
        sendOrderConfirmationEmail({
          to: customerEmail,
          customerName,
          orderNumber: existingOrder?.order_number || \`ORD-\${captureId.substring(0, 8).toUpperCase()}\`,
          productName: existingOrder?.book_name || "Marketing Reclassified",
          amount: capturedAmount.toFixed(2),
          currency: capturedCurrency,
          downloadUrl,
          editionType: detectedEdition,
          expiryHours,
          downloadLimit: detectedEdition === "online" ? 0 : 3,
        }).catch(emailErr => console.warn("[paypalWebhook] Confirmation email delivery notice:", emailErr.message));
      }`
  }
];

patchFile(path.join(backendDir, 'controllers/paypalController.js'), paypalControllerPatch);
if (fs.existsSync(apiLibDir)) {
  patchFile(path.join(apiLibDir, 'paypalController.js'), paypalControllerPatch);
}

console.log('Async email optimization complete.');
