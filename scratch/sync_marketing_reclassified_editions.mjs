import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cneariiepqywvjpmznqn.supabase.co';
const SUPABASE_SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuZWFyaWllcHF5d3ZqcG16bnFuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjQyMDMxNSwiZXhwIjoyMDg3OTk2MzE1fQ.lKho4GyKZ7HpFWBtpj5H6PypdFk-eFCXLPZ_HMALBCE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

async function syncEditions() {
  const { data: book, error: fetchErr } = await supabase
    .from('ebooks')
    .select('*')
    .eq('slug', 'marketing-reclassified')
    .single();

  if (fetchErr) {
    console.error('Error fetching Marketing Reclassified:', fetchErr);
    process.exit(1);
  }

  console.log('Current access_options:', JSON.stringify(book.access_options, null, 2));

  const updatedAccessOptions = [
    {
      book_code: "MR-ONLINE-001",
      name: "Online Reading Edition",
      badge: "",
      price: 20,
      currency: "USD",
      access_type: "online",
      status: "active",
      cta_text: "Get Online Access · $20",
      payhip_product_id: "",
      payhip_checkout_url: "",
      can_read_online: true,
      can_download: false,
      upgrade_payhip_product_id: "",
      upgrade_price: 29.99,
      online_file_path: book.file_path || "ebooks/marketing-reclassified.pdf",
      download_file_path: "",
      description: "Read and explore the ideas at your own pace.",
      features: [
        "Access the complete book through a protected online reader.",
        "Read through your registered account.",
        "Includes the Reader Companion.",
        "__exclude__PDF downloading is not included.",
        "__exclude__Full Ask SID access is not included."
      ]
    },
    {
      book_code: "MR-COMPANION-001",
      name: "Digital Companion Edition",
      badge: "INCLUDES ASK SID",
      price: 49.99,
      currency: "USD",
      access_type: "companion",
      status: "active",
      cta_text: "Get Digital Companion · $49.99",
      payhip_product_id: "",
      payhip_checkout_url: "",
      can_read_online: true,
      can_download: true,
      upgrade_payhip_product_id: "",
      upgrade_price: 29.99,
      online_file_path: book.file_path || "ebooks/marketing-reclassified.pdf",
      download_file_path: book.file_path || "ebooks/marketing-reclassified.pdf",
      description: "Own the book. Explore the thinking. Apply the principles.",
      features: [
        "Read the complete book online.",
        "Download your personal PDF copy.",
        "Access the full Ask SID book companion, subject to usage conditions.",
        "Includes the Reader Companion and additional practical companion resources."
      ]
    }
  ];

  const { data: updated, error: updateErr } = await supabase
    .from('ebooks')
    .update({ access_options: updatedAccessOptions })
    .eq('id', book.id)
    .select()
    .single();

  if (updateErr) {
    console.error('Failed to update access_options:', updateErr);
  } else {
    console.log('Successfully updated access_options on Supabase for Marketing Reclassified!');
    console.log(JSON.stringify(updated.access_options, null, 2));
  }
}

syncEditions().catch(console.error);
