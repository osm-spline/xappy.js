/**
 * @description this function is called by the http handler to choose an
 *              generator implmentation.
 */
// TODO make this more abstract, inject Generators
// need a default value and a mapping
// TODO whats about miltiple content types and $NOT_APPLICATION/json
function getGeneratorSelector(copyright) {
    return function generatorSelector(contentType) {

        if (contentType === null) {
            contentType = 'application/xml';
        }

        var json_hit = contentType.search('application/json');
        var xml_hit = contentType.search('application/xml');

        var Generator;
        var parameters = {
            version: XAPI_VERSION,
            generator:'xappy.js v' + XAPPY_VERSION,
            planetDate: 'SELECT planetDate from DATABASE!!!!', // TODO XXX TODO
            copyright: copyright
        };

        if (json_hit === -1 && xml_hit === -1) {
           throw {
                'message': 'Invalid Content-Type', 'code': 415
            };
        }
        if (json_hit === -1) {
            Generator = XmlGenerator;
        } else if (xml_hit === -1) {
            Generator = JSONGenerator;
        } else if (json_hit < xml_hit) {
            Generator = JSONGenerator;
        } else {
            Generator = XmlGenerator;
        }

        return new Generator(parameters);
    };
}

exports.factory = getGeneratorSelector;
