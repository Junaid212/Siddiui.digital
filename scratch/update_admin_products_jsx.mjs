import fs from 'fs';

const adminFilePath = 'd:/Bright Media WORK/siddique-admin/client/src/pages/DigitalProducts.jsx';
let content = fs.readFileSync(adminFilePath, 'utf8');

// 1. Update EMPTY_OPTION
const oldEmptyOption = [
  "const EMPTY_OPTION = {",
  "    book_code: '',",
  "    name: '',",
  "    badge: '',",
  "    description: '',",
  "    price: '',",
  "    currency: 'USD',",
  "    access_type: 'companion',",
  "    status: 'active',",
  "    cta_text: '',",
  "    online_file_path: '',",
  "    download_file_path: '',",
  "    features: []",
  "};"
].join('\n');

const newEmptyOption = [
  "const EMPTY_OPTION = {",
  "    book_code: '',",
  "    name: '',",
  "    badge: '',",
  "    description: '',",
  "    price: '',",
  "    currency: 'USD',",
  "    access_type: 'companion',",
  "    status: 'active',",
  "    cta_text: '',",
  "    payhip_product_id: '',",
  "    payhip_checkout_url: '',",
  "    can_read_online: true,",
  "    can_download: true,",
  "    upgrade_payhip_product_id: '',",
  "    upgrade_price: '29.99',",
  "    online_file_path: '',",
  "    download_file_path: '',",
  "    features: []",
  "};"
].join('\n');

if (!content.includes(oldEmptyOption)) {
  console.log('Already updated or checking with CRLF...');
  const oldCRLF = oldEmptyOption.replace(/\n/g, '\r\n');
  if (content.includes(oldCRLF)) {
    content = content.replace(oldCRLF, newEmptyOption.replace(/\n/g, '\r\n'));
  } else {
    console.error('Could not find EMPTY_OPTION');
    process.exit(1);
  }
} else {
  content = content.replace(oldEmptyOption, newEmptyOption);
}

// 2. Add Payhip fields to OptionForm
const targetMarker = '{/* Dedicated Document Association for this Edition */}';

const payhipFields = [
  '            {/* Payhip Product & Checkout Configuration */}',
  '            <div style={{ display: \'grid\', gridTemplateColumns: \'1fr 1fr\', gap: 8, background: \'rgba(238, 77, 45, 0.05)\', padding: 10, borderRadius: 6, border: \'1px solid rgba(238, 77, 45, 0.2)\' }}>',
  '                <div>',
  '                    <label style={{ ...labelStyle, fontSize: \'0.73rem\', color: \'#f87171\' }}>',
  '                        💳 Payhip Product ID',
  '                    </label>',
  '                    <input',
  '                        placeholder="e.g. AbC12 or leave empty if using custom URL"',
  '                        value={val.payhip_product_id || \'\'}',
  '                        onChange={e => setVal(p => ({ ...p, payhip_product_id: e.target.value.trim() }))}',
  '                        style={{ ...inputStyle, fontSize: \'0.78rem\' }}',
  '                    />',
  '                </div>',
  '                <div>',
  '                    <label style={{ ...labelStyle, fontSize: \'0.73rem\', color: \'#f87171\' }}>',
  '                        🔗 Payhip Direct Checkout URL',
  '                    </label>',
  '                    <input',
  '                        placeholder="https://payhip.com/b/XXXX"',
  '                        value={val.payhip_checkout_url || \'\'}',
  '                        onChange={e => setVal(p => ({ ...p, payhip_checkout_url: e.target.value.trim() }))}',
  '                        style={{ ...inputStyle, fontSize: \'0.78rem\' }}',
  '                    />',
  '                </div>',
  '                <div>',
  '                    <label style={{ ...labelStyle, fontSize: \'0.73rem\', color: \'#fbbf24\' }}>',
  '                        ⚡ Upgrade Payhip Product ID ($29.99)',
  '                    </label>',
  '                    <input',
  '                        placeholder="e.g. UpGr4de12 (for Online -> Companion upgrade)"',
  '                        value={val.upgrade_payhip_product_id || \'\'}',
  '                        onChange={e => setVal(p => ({ ...p, upgrade_payhip_product_id: e.target.value.trim() }))}',
  '                        style={{ ...inputStyle, fontSize: \'0.78rem\' }}',
  '                    />',
  '                </div>',
  '                <div>',
  '                    <label style={{ ...labelStyle, fontSize: \'0.73rem\', color: \'#fbbf24\' }}>',
  '                        💰 Upgrade Price Difference (USD)',
  '                    </label>',
  '                    <input',
  '                        type="number"',
  '                        step="0.01"',
  '                        placeholder="29.99"',
  '                        value={val.upgrade_price ?? \'29.99\'}',
  '                        onChange={e => setVal(p => ({ ...p, upgrade_price: e.target.value }))}',
  '                        style={{ ...inputStyle, fontSize: \'0.78rem\' }}',
  '                    />',
  '                </div>',
  '                <div style={{ gridColumn: \'span 2\', display: \'flex\', gap: 16, paddingTop: 4 }}>',
  '                    <label style={{ display: \'flex\', alignItems: \'center\', gap: 6, fontSize: \'0.78rem\', color: \'#e5e7eb\', cursor: \'pointer\' }}>',
  '                        <input',
  '                            type="checkbox"',
  '                            checked={val.can_read_online !== false}',
  '                            onChange={e => setVal(p => ({ ...p, can_read_online: e.target.checked }))}',
  '                        />',
  '                        <span>📖 Online Reader Eligible</span>',
  '                    </label>',
  '                    <label style={{ display: \'flex\', alignItems: \'center\', gap: 6, fontSize: \'0.78rem\', color: \'#e5e7eb\', cursor: \'pointer\' }}>',
  '                        <input',
  '                            type="checkbox"',
  '                            checked={val.can_download !== false && val.access_type !== \'online\'}',
  '                            onChange={e => setVal(p => ({ ...p, can_download: e.target.checked }))}',
  '                        />',
  '                        <span>📥 PDF Download Eligible</span>',
  '                    </label>',
  '                </div>',
  '            </div>',
  '',
  '            {/* Dedicated Document Association for this Edition */}'
].join('\n');

if (content.includes(targetMarker)) {
  const isCRLF = content.includes('\r\n');
  content = content.replace(targetMarker, isCRLF ? payhipFields.replace(/\n/g, '\r\n') : payhipFields);
}

// 3. Update the edition summary card in AccessOptionsManager
const oldSummary = '<p style={{ color: \'#10b981\', fontSize: \'0.8rem\', margin: \'2px 0 0\' }}>{opt.currency || \'USD\'} {Number(opt.price).toFixed(2)} · {opt.access_type} · {opt.status}</p>';

const newSummary = [
  '                                <div style={{ display: \'flex\', gap: 8, alignItems: \'center\', flexWrap: \'wrap\', marginTop: 3 }}>',
  '                                    <span style={{ color: \'#10b981\', fontSize: \'0.8rem\', fontWeight: 600 }}>{opt.currency || \'USD\'} {Number(opt.price).toFixed(2)}</span>',
  '                                    <span style={{ color: \'#9ca3af\', fontSize: \'0.75rem\' }}>· {opt.access_type} · {opt.status}</span>',
  '                                    {opt.payhip_product_id && (',
  '                                        <span style={{ background: \'rgba(238, 77, 45, 0.15)\', color: \'#f87171\', border: \'1px solid rgba(238, 77, 45, 0.3)\', fontSize: \'0.68rem\', padding: \'1px 6px\', borderRadius: 4, fontFamily: \'monospace\' }}>',
  '                                            Payhip ID: {opt.payhip_product_id}',
  '                                        </span>',
  '                                    )}',
  '                                    {opt.upgrade_payhip_product_id && (',
  '                                        <span style={{ background: \'rgba(251, 191, 36, 0.15)\', color: \'#fbbf24\', border: \'1px solid rgba(251, 191, 36, 0.3)\', fontSize: \'0.68rem\', padding: \'1px 6px\', borderRadius: 4, fontFamily: \'monospace\' }}>',
  '                                            Upgrade ID: {opt.upgrade_payhip_product_id}',
  '                                        </span>',
  '                                    )}',
  '                                    <span style={{ fontSize: \'0.7rem\', color: opt.can_read_online !== false ? \'#34d399\' : \'#6b7280\' }}>',
  '                                        {opt.can_read_online !== false ? \'✓ Online Reader\' : \'✗ No Reader\'}',
  '                                    </span>',
  '                                    <span style={{ fontSize: \'0.7rem\', color: (opt.can_download !== false && opt.access_type !== \'online\') ? \'#60a5fa\' : \'#6b7280\' }}>',
  '                                        {(opt.can_download !== false && opt.access_type !== \'online\') ? \'✓ PDF Download\' : \'✗ No Download\'}',
  '                                    </span>',
  '                                </div>'
].join('\n');

if (content.includes(oldSummary)) {
  const isCRLF = content.includes('\r\n');
  content = content.replace(oldSummary, isCRLF ? newSummary.replace(/\n/g, '\r\n') : newSummary);
}

fs.writeFileSync(adminFilePath, content, 'utf8');
console.log('Successfully updated DigitalProducts.jsx with Payhip & Edition management fields!');
