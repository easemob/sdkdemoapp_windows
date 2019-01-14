console.log('DEBUG ENV', {
    'global.DEBUG': global.DEBUG,
    DEBUG: typeof DEBUG === 'undefined' ? 'undefined' : DEBUG,
    'process.env.NODE_ENV': process.env.NODE_ENV
});

if (typeof DEBUG === 'undefined') {
    global.DEBUG = process.env.NODE_ENV === 'debug' || process.env.NODE_ENV === 'development';
} else {
    global.DEBUG = DEBUG;
}

if (global.DEBUG) {
    console.log('DEBUG', global.DEBUG, process.env.NODE_ENV);

    // Mute react router warning.
    console._error = console.error;
    console.error = (errMessage, ...args) => {
        if (typeof errMessage === 'string' && (errMessage.indexOf('Warning: Hash history cannot PUSH the same path;') === 0 || errMessage.startsWith('Warning: Failed prop type: Prop paneStyle passed to SplitPane. Has invalid keys userSelect') || errMessage.startsWith('Warning: Failed prop type: Prop style passed'))) {
            return;
        }
        return console._error(errMessage, ...args);
    };

    // Mute react router warning.
    console._warn = console.warn;
    console.warn = (errMessage, ...args) => {
        if (typeof errMessage === 'string' && errMessage.startsWith('iterable.length has been deprecated, use iterable.size or iterable.count')) {
            return;
        }
        return console._warn(errMessage, ...args);
    };

    if (process.browser || process.type === 'renderer') {
        const STYLE = {
            rounded: 'border-radius: 3px;',
            block: 'display: block;',
            bold: 'font-weight: bold;',
            h1: 'font-size: 24px; font-weight: bold;',
            h2: 'font-size: 20px; font-weight: bold;',
            h3: 'font-size: 18px; font-weight: bold;',
            h4: 'font-size: 16px; font-weight: bold;',
            h5: 'font-size: 14px; font-weight: bold;',
            h6: 'font-size: 12px; font-weight: bold;',
            muted: 'color: #aaa;',

            pink: 'color: #e91e63;',
            pinkLight: 'color: #ff6090;',
            pinkDark: 'color: #b0003a;',
            pinkPale: 'background: #fce4ec; color: #e91e63;',
            pinkBg: 'background: #e91e63; color: #fff;',
            pinkBgLight: 'background: #ff6090; color: #fff;',
            pinkBgDark: 'background: #b0003a; color: #fff;',
            pinkOutline: 'color: #e91e63; border-color: #e91e63;',


            blue: 'color: #2196f3;',
            blueLight: 'color: #6ec6ff;',
            blueDark: 'color: #0069c0;',
            bluePale: 'background: #e3f2fd; color: #2196f3;',
            blueBg: 'background: #2196f3; color: #fff;',
            blueBgLight: 'background: #6ec6ff; color: #fff;',
            blueBgDark: 'background: #0069c0; color: #fff;',
            blueOutline: 'color: #2196f3; border-color: #2196f3;',

            green: 'color: #4caf50;',
            greenLight: 'color: #80e27e;',
            greenDark: 'color: #087f23;',
            greenPale: 'background: #e8f5e9; color: #4caf50;',
            greenBg: 'background: #4caf50; color: #fff;',
            greenBgLight: 'background: #80e27e; color: #fff;',
            greenBgDark: 'background: #087f23; color: #fff;',
            greenOutline: 'color: #4caf50; border-color: #4caf50;',

            red: 'color: #f44336;',
            redLight: 'color: #ff7961;',
            redDark: 'color: #ba000d;',
            redPale: 'background: #ffebee; color: #f44336;',
            redBg: 'background: #f44336; color: #fff;',
            redBgLight: 'background: #ff7961; color: #fff;',
            redBgDark: 'background: #ba000d; color: #fff;',
            redOutline: 'color: #f44336; border-color: #f44336;',

            orange: 'color: #ff9800;',
            orangeLight: 'color: #ffc947;',
            orangeDark: 'color: #c66900;',
            orangePale: 'background: #fff3e0; color: #ff9800;',
            orangeBg: 'background: #ff9800; color: #fff;',
            orangeBgLight: 'background: #ffc947; color: #fff;',
            orangeBgDark: 'background: #c66900; color: #fff;',
            orangeOutline: 'color: #ff9800; border-color: #ff9800;',

            deepOrange: 'color: #ff5722;',
            deepOrangeLight: 'color: #ff8a50;',
            deepOrangeDark: 'color: #c41c00;',
            deepOrangePale: 'background: #fbe9e7; color: #ff5722;',
            deepOrangeBg: 'background: #ff5722; color: #fff;',
            deepOrangeBgLight: 'background: #ff8a50; color: #fff;',
            deepOrangeBgDark: 'background: #c41c00; color: #fff;',
            deepOrangeOutline: 'color: #ff5722; border-color: #ff5722;',

            purple: 'color: #9c27b0;',
            purpleLight: 'color: #d05ce3;',
            purpleDark: 'color: #6a0080;',
            purplePale: 'background: #f3e5f5; color: #9c27b0;',
            purpleBg: 'background: #9c27b0; color: #fff;',
            purpleBgLight: 'background: #d05ce3; color: #fff;',
            purpleBgDark: 'background: #6a0080; color: #fff;',
            purpleOutline: 'color: #9c27b0; border-color: #9c27b0;',

            teal: 'color: #009688;',
            tealLight: 'color: #52c7b8;',
            tealDark: 'color: #00675b;',
            tealPale: 'background: #e0f2f1; color: #009688;',
            tealBg: 'background: #009688; color: #fff;',
            tealBgLight: 'background: #52c7b8; color: #fff;',
            tealBgDark: 'background: #00675b; color: #fff;',
            tealOutline: 'color: #009688; border-color: #009688;',

            indigo: 'color: #3f51b5;',
            indigoLight: 'color: #757de8;',
            indigoDark: 'color: #002984;',
            indigoPale: 'background: #e8eaf6; color: #3f51b5;',
            indigoBg: 'background: #3f51b5; color: #fff;',
            indigoBgLight: 'background: #757de8; color: #fff;',
            indigoBgDark: 'background: #002984; color: #fff;',
            indigoOutline: 'color: #3f51b5; border-color: #3f51b5;',
        };

        const formatOutput = (args) => {
            const output = [''];
            const format = [];
            args.forEach((arg, idx) => {
                const index = Math.floor(idx / 2);
                if (idx % 2 === 1) {
                    format[index] = `%c${format[index]}`;
                    let style = 'padding: 0 4px; border: 1px solid transparent;';
                    if (Array.isArray(arg)) {
                        style += arg.reduce((tmpStyle, styleName) => {
                            return tmpStyle + (STYLE[styleName] || styleName);
                        }, '');
                    } else if (typeof arg === 'object') {
                        style += Object.keys(arg).reduce((tmpStyle, propName) => (`${tmpStyle}${propName}: ${arg[propName]}`), '');
                    } else {
                        style += STYLE[arg] || arg;
                    }
                    output.push(style);
                } else {
                    format.push(arg);
                }
            });
            output[0] = format.join('');
            return output;
        };

        console.formatOutput = formatOutput;

        console.color = (...args) => {
            console.log(...formatOutput(args));
        };

        console.collapse = (...args) => {
            console.groupCollapsed(...formatOutput(args));
        };

        console.expand = (...args) => {
            console.group(...formatOutput(args));
        };

        const showHashPath = () => {
            console.color('➜', 'orangeBg', window.location.hash.substr(1), 'orangePale');
        };
        window.addEventListener('hashchange', showHashPath, false);
        showHashPath();
    }

    global.$ = {};
} else if (process.env.NODE_ENV !== 'production') {
    console.log('DEBUG', global.DEBUG, process.env.NODE_ENV);
}

export default global.DEBUG;
