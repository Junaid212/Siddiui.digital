import fs from 'fs';

function updatePayhipControllerFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Update executeWithSchemaFallback to handle 22P02 integer syntax error on amount
  const oldFallback = `    const match = res.error.message?.match(/Could not find the '([^']+)' column/i) ||
                  res.error.message?.match(/column ['"]?([a-zA-Z0-9_]+)['"]? of ['"]?orders['"]? does not exist/i) ||
                  res.error.message?.match(/column ['"]?([a-zA-Z0-9_]+)['"]? does not exist/i) ||
                  res.error.message?.match(/Could not find the column '([^']+)'/i);`;

  const newFallback = `    // Handle integer schema constraint for orders.amount
    if (res.error.code === '22P02' && typeof currentPayload.amount === 'number' && !Number.isInteger(currentPayload.amount)) {
      console.warn(\`[Payhip] orders.amount requires integer in live schema, rounding \${currentPayload.amount} to \${Math.round(currentPayload.amount)}\`);
      currentPayload.amount = Math.round(currentPayload.amount);
      continue;
    }

    const match = res.error.message?.match(/Could not find the '([^']+)' column/i) ||
                  res.error.message?.match(/column ['"]?([a-zA-Z0-9_]+)['"]? of ['"]?orders['"]? does not exist/i) ||
                  res.error.message?.match(/column ['"]?([a-zA-Z0-9_]+)['"]? does not exist/i) ||
                  res.error.message?.match(/Could not find the column '([^']+)'/i);`;

  if (content.includes(oldFallback)) {
    content = content.replace(oldFallback, newFallback);
  }

  // 2. Safe amount calculation
  const oldAmt = `amount: parseFloat(totalAmount),`;
  const newAmt = `amount: Number.isInteger(parseFloat(totalAmount)) ? parseFloat(totalAmount) : Math.round(parseFloat(totalAmount)),`;

  if (content.includes(oldAmt)) {
    content = content.replace(oldAmt, newAmt);
  }

  // 3. raw_metadata exact amount
  const oldMeta = `payhip_payload: {`;
  const newMeta = `exact_amount: totalAmount,\n            payhip_payload: {`;

  if (content.includes(oldMeta)) {
    content = content.replace(oldMeta, newMeta);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

updatePayhipControllerFile('d:/Bright Media WORK/siddiqui-backend/server/controllers/payhipController.js');
updatePayhipControllerFile('d:/Bright Media WORK/Siddiui.digital-main/Siddiui.digital-main/api/_lib/payhipController.js');
