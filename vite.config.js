import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Plugin to copy generated framework images into public assets on startup
const copyFrameworkImages = () => {
  const doCopy = () => {
    const artifactsDir = 'C:/Users/Lenovo/.gemini/antigravity-ide/brain/761ca760-9f4e-4f8b-9fba-748eb89bbf3f';
    const destDir = path.resolve('./public/assets/images/img');
    const filesToCopy = [
      { src: 'framework_purpose_profit_1781261842000.png', dest: 'framework_a.png' },
      { src: 'framework_avf_1781261853104.png', dest: 'framework_b.png' },
      { src: 'framework_vdi_1781261862507.png', dest: 'framework_c.png' },
    ];
    for (const f of filesToCopy) {
      const srcPath = path.join(artifactsDir, f.src);
      const destPath = path.join(destDir, f.dest);
      if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
        try { fs.copyFileSync(srcPath, destPath); console.log(`[framework-images] Copied ${f.dest}`); } catch (e) { /* ignore */ }
      }
    }
  };
  return {
    name: 'copy-framework-images',
    buildStart: doCopy,
    configureServer: doCopy,
  };
};


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copyFrameworkImages()],
  // Custom domain deployment — base must be "/"
  base: "/",
  build: {
    rollupOptions: {
      output: {
        // Split large vendor chunks for better caching
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          icons: ['lucide-react'],
        },
      },
    },
    // Warn if any chunk exceeds 600kb
    chunkSizeWarningLimit: 600,
  },
})

