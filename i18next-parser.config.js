export default {
  locales: ["en", "hi", "bho"],
  output: "src/i18n/locales/$LOCALE/translation.json",
  input: ["src/**/*.{js,jsx}"],
  sort: true,
  createOldCatalogs: false,
  keepRemoved: true, // Set to true if you don't want to lose old keys
  keySeparator: false,
};
