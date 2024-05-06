/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          maoken: [`maoken`],
          Italianno: [`Italianno`],
          MochiyPopOne: [`Mochiy Pop One`],
          nishikiteki: [`Nishikiteki`],
          yezi: ['YeZi'],
        },
      },
    },
    plugins: [require("daisyui")],
}

