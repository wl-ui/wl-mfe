import translations from './TranslationsZh';


export default function translate(template, replacements) {
    replacements = replacements || {};

    // Translate
    template = translations[template] || template;

    // Replace
    return template.replace(/{([^}]+)}/g, function (_, key) {

        var str = replacements[key];
        if ((translations[replacements[key]] != null) && (translations[replacements[key]] != 'undefined')) {
            str = translations[replacements[key]];
        }
        return str || '{' + key + '}';

    });
}
