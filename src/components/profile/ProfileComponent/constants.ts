export const templates = {
  default: {
    title: 'General',
    intro: 'Anything and Everything'
  },
  crypto: {
    title: 'Crypto',
    intro: 'Step into Web3'
  }
};

export const themes = {
  default: {
    backgroundColor: '#F7FAFC',
    profileHeader: {
      bgColor: 'white',
      title: {
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: '28px',
        lineHeight: '136.02%',
        color: '#27272E'
      },
      introTxt: {
        fontSize: '16px',
        lineHeight: '162.02%',
        display: 'flex',
        alignItems: 'center',
        color: '#425466'
      },
      infoTxt: {
        fontSize: '14px',
        lineHeight: '162.02%',
        alignItems: 'center',
        color: '#979797'
      },
      button: {
        background: '#4C6FFF',
        borderRadius: '9px',
        text: {
          fontWeight: 600,
          fontSize: '12px',
          lineHeight: '12px',
          color: '#FFFFFF'
        }
      }
    },
    gridContent: {
      width: '100%',
      zIndex: 100,
      backgroundColor: '#F7FAFC'
    },
    card: {
      backgroundColor: 'white',
      cardTitle: '#27272E',
      cardTitle1: '#27272E',
      cardTitle2: '#27272E',
      cardTitle3: '#27272E',
      cardText: 'rgba(66, 84, 102, 0.57)',
      cardShadow:
        '0px 0px 1px rgba(12, 26, 75, 0.24), 0px 3px 8px -1px rgba(50, 50, 71, 0.05)'
    }
  },
  crypto: {}
};
