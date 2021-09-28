export const allTemplates: Template[] = [
  {
    value: 'default',
    title: 'General Profile',
    intro: 'Everything displayed'
  },
  {
    value: 'crypto',
    title: 'Crypto Enthusiast',
    intro: 'Stocks, Investors or buzz-word enthusiast'
  },
  {
    value: 'gamer',
    title: 'Computer Gaming',
    intro: 'Computers are my thing and I rule it'
  },
  {
    value: 'soccer',
    title: 'Soccer/Football',
    intro: 'For Players & die hard fans'
  },
  {
    value: 'education',
    title: 'Academic',
    intro: 'For students, teachers, researchers'
  }
];

export const themeData = {
  default: {
    container: {
      backgroundColor: '#F7FAFC'
    },
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
      backgroundColor: '#F7FAFC'
    },
    card: {
      backgroundColor: 'white',
      overviewText: '#6980A2',
      cardTitle: '#27272E',
      cardTitle1: '#27272E',
      cardTitle2: '#27272E',
      cardTitle3: '#27272E',
      cardText: 'rgba(66, 84, 102, 0.57)',
      cardShawdow:
        '0px 0px 1px rgba(12, 26, 75, 0.24), 0px 3px 8px -1px rgba(50, 50, 71, 0.05)'
    }
  },
  crypto: {
    container: {
      backgroundColor: '#1A202C'
    },
    gridContent: {
      backgroundColor: '#1A202C'
    },
    card: {
      backgroundColor: '#141419',
      overviewText: '#6980A2',
      cardTitle: '#718096',
      cardTitle1: '#CBD5E0',
      cardTitle2: '#A0AEC0',
      cardTitle3: '#A0AEC0',
      cardText: '#718096',
      cardShawdow:
        'box-shadow: 0px 0px 1px rgba(12, 26, 75, 0.24), 0px 3px 8px -1px rgba(50, 50, 71, 0.05);'
    }
  },
  gamer: {
    container: {
      backgroundColor: '#1F1F35'
    },
    gridContent: {
      backgroundColor: '#1F1F35'
    },
    card: {
      backgroundColor: '#141419',
      overviewText: '#6980A2',
      cardTitle: '#718096',
      cardTitle1: '#CBD5E0',
      cardTitle2: '#A0AEC0',
      cardTitle3: '#A0AEC0',
      cardText: '#718096',
      cardShawdow:
        'box-shadow: 0px 0px 1px rgba(12, 26, 75, 0.24), 0px 3px 8px -1px rgba(50, 50, 71, 0.05);'
    }
  }
};
