async function main() {
  try {
    const r = await fetch('http://localhost:5000/');
    console.log('GET / status:', r.status);
    const text = await r.text();
    console.log('GET / body:', text.slice(0, 200));
  } catch (err) {
    console.error('GET / err:', err.message);
  }
}
main();
