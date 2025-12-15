Convert start-logo.svg to optimized PNGs

This project includes a small Node script to convert the SVG logo into multiple optimized PNG sizes for compatibility and performance.

How to run

1. Install dev dependency (sharp is already listed in devDependencies):

   npm install

2. Run the converter:

   npm run convert-start-logo

Outputs

- client/public/images/start-logo.png (alias, 256px)
- client/public/images/start-logo-64.png
- client/public/images/start-logo-128.png
- client/public/images/start-logo-256.png
- client/public/images/start-logo-512.png
- client/public/images/start-logo-1024.png

Notes

- The script uses sharp to rasterize the SVG at high density and write optimized PNGs. If you want WebP/AVIF variants, modify the script to call `.webp()` or `.avif()` in addition to `.png()`.
- If the script doesn't produce all sizes, run it again and check for errors in the console. On CI, ensure native dependencies for sharp are available.

