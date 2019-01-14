import Color from './color';

const DEFAULT_OPTIONS = {
    outline: false,
    pale: false,
    dark: false,
    code: 'random',
    textTint: true,
    backTint: true,
    textColor: '',
    darkText: '#fff',
    lightText: '#333',
    hueSpace: 43,
    threshold: 0.43,
    darkLight: 0.4,
    paleLight: 0.92,
    saturation: 0.7,
    lightness: 0.6,
    longShadow: false,
    // name: '',
};

const getCodeFromString = (str) => {
    if (!str) {
        return 0;
    }
    return str.split('')
        .map(char => char.charCodeAt(0))
        .reduce((current, previous) => previous + current);
};

const longShadow = (longShadow, color, returnShadow = false, darkenAmount = 8) => {
    if (typeof longShadow !== 'number') {
        longShadow = 40;
    }
    const shadowColor = Color.create(color).darken(darkenAmount).css;
    const textShadowArr = [];
    for (let i = 1; i <= longShadow; ++i) {
        textShadowArr.push(`${shadowColor} ${i}px ${i}px`);
    }
    const textShadow = textShadowArr.join(',');
    return returnShadow ? textShadow : {textShadow};
};

const style = (skinCode, options = {}) => {
    if (typeof skinCode === 'object') {
        options = skinCode;
    } else {
        options.code = skinCode;
    }
    options = Object.assign({}, DEFAULT_OPTIONS, options);

    let {
        outline,
        pale,
        dark,
        textTint,
        backTint,
        darkText,
        lightText,
        color,
        code,
        textColor,
        hueSpace,
        threshold,
        darkLight,
        paleLight,
        saturation,
        lightness,
        name,
        longShadow: thisLongShadow,
        ...other
    } = options;

    if (!color) {
        if (code === 'random') {
            code = Math.floor(Math.random() * 360);
        }
        if (typeof code === 'string') {
            if (!Color.isColor(code)) {
                code = getCodeFromString(code);
            }
        }
        if (typeof code === 'number') {
            code = {h: (code * hueSpace) % 360, s: saturation, l: lightness};
        }
        color = Color.create(code);
        if (code !== 'random') {
            options.color = color;
        }
    }

    let backColor = '';
    let borderColor = '';
    let fontColor = textColor;
    if (outline) {
        if (dark) {
            const darkColor = color.clone().setHsl({s: saturation, l: darkLight});
            borderColor = darkColor;
        } else if (pale) {
            const lightColor = color.clone().setHsl({s: saturation, l: paleLight});
            borderColor = lightColor;
        } else {
            borderColor = color;
        }
        if (!fontColor && textTint) {
            fontColor = borderColor;
        }
    } else if (backTint) {
        if (dark) {
            const darkColor = color.clone().setHsl({s: saturation, l: darkLight});
            backColor = darkColor;
        } else if (pale) {
            const lightColor = color.clone().setHsl({s: saturation, l: paleLight});
            backColor = lightColor;
        } else {
            backColor = color;
        }
        if (!fontColor) {
            if (backColor.isDark(threshold)) {
                fontColor = darkText;
            } else if (textTint) {
                const darkColor = color.clone().setHsl({s: saturation, l: darkLight});
                fontColor = darkColor;
            } else {
                fontColor = lightText;
            }
        }
    } else {
        if (dark) {
            const darkColor = color.clone().setHsl({s: saturation, l: darkLight});
            fontColor = darkColor;
        } else if (pale) {
            const lightColor = color.clone().setHsl({s: saturation, l: paleLight});
            fontColor = lightColor;
        } else {
            fontColor = color;
        }
    }

    const style = Object.assign({}, other);
    if (backColor) style.backgroundColor = backColor.css || backColor;
    if (borderColor) style.borderColor = borderColor.css || borderColor;
    if (fontColor) style.color = fontColor.css || fontColor;
    if (thisLongShadow) {
        style.textShadow = longShadow(thisLongShadow, backColor, true);
    }
    return style;
};

const text = (skinCode, options) => {
    return style(skinCode, Object.assign({backTint: false}, options));
};

export default {
    style,
    text,
    longShadow,
};
