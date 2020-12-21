const common = {
  breakpoints: {
    phone: 320,
    tablet: 768,
    desktop: 1280,
  },
};

module.exports = {
  themes: {
    light: {
      ...common,
      colors: {
        primary: '#3B5FF1',
      },
    },
    dark: {
      ...common,
      colors: {
        primary: '#344356',
      },
    },
  },
};
