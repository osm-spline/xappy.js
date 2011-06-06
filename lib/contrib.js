
module.exports = {
    lpad: function(str, width) {
        str = String(str);
        var n = width - str.length;
        if (n < 1) return str;
        while (n--) str = ' ' + str;
        return str;
    },

    rpad: function(str, width) {
        str = String(str);
        var n = width - str.length;
        if (n < 1) return str;
        while (n--) str = str + ' ';
        return str;
    },
};
