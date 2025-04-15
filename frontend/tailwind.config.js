import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                stamindTask: {
                    white: {
                        '000': '#FFFFFF',
                        '100': '#EEEFFC',
                        '150': '#E0E1EC',
                        '200': '#D2D3E0',
                    },
                    grey: {
                        '200': '#858699',
                        '300': '#4D4F69',
                        '400': '#393A4B',
                        '600': '#272832',
                        '800': '#313248',
                    },
                    black: {
                        '400': '#2C2D3C',
                        '600': '#292A35',
                        '800': '#191A23',
                        '850': '#151621',
                    },
                    'primary-blue': {
                        '200': '#71A5DD',
                        '600': '#37466C',
                        '800': '#2058AF',
                        '900': '#064AB5',
                    },
                    specific: {
                        background_primary: '#181921',
                        'letter-bg': '#9595BD',
                        'file-bg': '#434563',
                        'issue-bg': '#595974',
                        'text-bg': '#1D1E2B',
                        'sub-issue-bg': '#131420',
                        'button-bg': '#858698',
                        'button-issue-hover-bg': '#5E5D7B',
                        'command-bar-bg': '#1D1E2B',
                        'tooltip-bg': '#202128',
                        'button-hover': '#272832',
                        'sub-issue-hover': '#1B1C29',
                        'command-bar-border': '#52526F',
                        'icon-default': '#D8E0FE',
                        divider: '#52526F',
                        'checkbox-border': '#DCD8FE',
                    },
                    decoration: {
                        'primary-1': '#4EA7FC',
                        'primary-2': '#00B2BF',
                        'error-1': '#EB5757',
                        'error-2': '#FA6563',
                        'warn-1': '#F2C94C',
                        'warn-2': '#F2994A',
                        purple: '#BB87FC',
                        block: '#95A2B3',
                        success: '#4CB782',
                    },
                }
            },
            keyframes: {
                SlideUpToIn: {
                    '0%': {transform: 'translateY(50px)', opacity: 0},
                    '100%': {transform: 'translateY(0)', opacity: 1},
                },
                fadeIn: {
                    '0%': {opacity: 0},
                    '100%': {opacity: 1},
                },
                SlideUpAndScale: {
                    '0%': {
                        transform: 'translateY(50px) scale(0.8)', opacity: 0
                    },
                    '100%': {transform: 'translateY(0) scale(1)', opacity: 1},
                },
                marquee: {
                    '0%': {backgroundPosition: '0% 100%'},
                    '100%': {backgroundPosition: '100% 100%'},
                },
                gentleFloat: {
                    '0%, 100%': {
                        transform: 'translateY(0) scale(1)',
                        opacity: 0.05,
                    },
                    '50%': {
                        transform: 'translateY(-10px) scale(1.02)',
                        opacity: 0.08,
                    }
                },
                gradientMove: {
                    '0%': {
                        backgroundPosition: '0% 50%',
                    },
                    '50%': {
                        backgroundPosition: '100% 50%',
                    },
                    '100%': {
                        backgroundPosition: '0% 50%',
                    }
                }
            },
            animation: {
                fadeIn: 'fadeIn 0.5s ease forwards',
                loginSlideIn:
                    'SlideUpToIn 0.8s ease forwards',
                messageSlideIn:
                    'SlideUpAndScale 0.4s ease forwards',
                tooltipSlideIn:
                    'SlideUpAndScale 0.4s ease forwards',
                marquee:
                    'marquee 2.5s ease infinite',
                gradientMove:
                    'gradientMove 6s ease infinite'
            }
            ,
        },
    },
    variants: {
        extend: {
            backgroundClip: ['text'], // 啟用 bg-clip-text
        }
        ,
    }
    ,
    plugins: [
        require('@tailwindcss/typography')
    ],
})
;
