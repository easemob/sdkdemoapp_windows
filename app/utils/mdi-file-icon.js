/* eslint-disable */
const ICON_file_document = 'file-document';
const ICON_file_excel = 'file-excel';
const ICON_file_word = 'file-word';
const ICON_file_powerpoint = 'file-powerpoint';
const ICON_file_pdf = 'file-pdf';
const ICON_file_music = 'file-music';
const ICON_file_video = 'file-video';
const ICON_file_xml = 'file-xml';
const ICON_file_image = 'file-image';
const ICON_zip_box = 'zip-box';
const ICON_disk = 'disk';
const ICON_windows = 'windows';
const ICON_apple = 'apple';
const ICON_console = 'console';
const ICON_language_php = 'language-php';
const ICON_language_cpp = 'language-cpp';
const ICON_language_c = 'language-c';
const ICON_language_csharp = 'language-csharp';
const ICON_language_css3 = 'language-css3';
const ICON_language_python = 'language-python';
const ICON_language_go = 'language-go';
const ICON_language_html5 = 'language-html5';
const ICON_language_javascript = 'language-javascript';
const ICON_language_swift = 'language-swift';
const ICON_language_typescript = 'language-typescript';
const ICON_markdown = 'markdown';
/* eslint-enable */

const icons = {
    txt: ICON_file_document,
    md: ICON_markdown,
    doc: ICON_file_word,
    docx: ICON_file_word,
    pages: ICON_file_word,
    xls: ICON_file_excel,
    xlsx: ICON_file_excel,
    csv: ICON_file_excel,
    numbers: ICON_file_excel,
    ppt: ICON_file_powerpoint,
    pptx: ICON_file_powerpoint,
    key: ICON_file_powerpoint,
    pdf: ICON_file_pdf,
    zip: ICON_zip_box,
    '7z': ICON_zip_box,
    rar: ICON_zip_box,
    iso: ICON_disk,
    dmg: ICON_disk,
    exe: ICON_windows,
    app: ICON_apple,
    bat: ICON_console,
    sh: ICON_console,
    avi: ICON_file_video,
    mp4: ICON_file_video,
    mkv: ICON_file_video,
    mov: ICON_file_video,
    wmv: ICON_file_video,
    ogg: ICON_file_music,
    mp3: ICON_file_music,
    wav: ICON_file_music,
    wma: ICON_file_music,
    aac: ICON_file_music,
    jpg: ICON_file_image,
    jpeg: ICON_file_image,
    png: ICON_file_image,
    gif: ICON_file_image,
    bmp: ICON_file_image,
    psd: ICON_file_image,
    tiff: ICON_file_image,
    svg: ICON_file_xml,
    cpp: ICON_language_cpp,
    c: ICON_language_c,
    php: ICON_language_php,
    js: ICON_language_javascript,
    css: ICON_language_css3,
    html: ICON_language_html5,
    htm: ICON_language_html5,
    ts: ICON_language_typescript,
    swift: ICON_language_swift,
    go: ICON_language_go,
    cs: ICON_language_csharp,
    py: ICON_language_python,
};

const getIcon = fileName => {
    if (fileName.includes('.')) {
        const ext = fileName.substr(fileName.lastIndexOf('.') + 1);
        const icon = icons[ext.toLowerCase()];
        if (icon) {
            return icon;
        }
    }
    return 'file-outline';
};

export default {
    getIcon
};
