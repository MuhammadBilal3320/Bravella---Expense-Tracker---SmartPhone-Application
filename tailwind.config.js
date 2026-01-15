/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins_400Regular'],
        poppinsMedium: ['Poppins_500Medium'],
        poppinsSemiBold: ['Poppins_600SemiBold'],
        poppinsBold: ['Poppins_700Bold'],
        poppinsExtraBold: ['Poppins_800ExtraBold'],
        poppinsBlack: ['Poppins_900Black'],
      },
    },
  },
  plugins: [],
};
