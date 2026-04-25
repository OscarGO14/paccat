import fetch from 'node-fetch';

const main = async () => {
  try {
    console.log('Testing dev server...');
    const res = await fetch('http://localhost:5173/');
    const html = await res.text();
    console.log('✓ Dev server is responding');

    // Check if index.html loads properly
    if (html.includes('Phaser') || html.includes('game')) {
      console.log('✓ HTML contains expected content');
    } else {
      console.log('⚠ HTML might be missing Phaser or game element');
    }

    // Try to load a module script
    const mainRes = await fetch('http://localhost:5173/src/main.ts');
    console.log(`  main.ts response status: ${mainRes.status}`);

  } catch (e) {
    console.error('Error:', e.message);
  }
};

main();
