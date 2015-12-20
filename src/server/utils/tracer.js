import moment from 'moment';
import { colorConsole } from "tracer";
import colors from "colors";

export default colorConsole({
    format : "[" + "{{timestamp}}".grey + "] " + "{{file}}:{{line}}: ".bold + "{{message}}",
    dateformat : "HH:MM:ss",
    filters : {
        log : [colors.white],
        trace : colors.magenta,
        debug : colors.blue,
        info : colors.green,
        warn : colors.yellow,
        error : colors.red
    }
});