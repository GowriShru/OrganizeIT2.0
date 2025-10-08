    // tailwind.config.js
    module.exports = {
      content: [
        "./src/**/*.{html,js,jsx,ts,tsx,vue}", // Adjust paths to your project structure
        "./src/components/**/*.{tsx, ts}",
        "./src/components/*.{tsx, ts}",

        // Add other file types/paths as needed
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    }