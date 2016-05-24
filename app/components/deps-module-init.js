if (window.module) {
    //
    // remove 'module' created by QUnit so that moment.js will install himself in the proper global scope
    // and bootstrap-datetimepicker will be able to load moment properly
    //
    window.moduleBkp = window.module;
    window.module = undefined;
}