
Ext.define("MontessoriCompass.view.progress.ProgressReports",{
    extend: "Ext.navigation.View",

    requires: [
        "MontessoriCompass.view.progress.ProgressReportsController",
        "MontessoriCompass.view.progress.ProgressReportsModel"
    ],

    controller: "progressreports",
    viewModel: {
        type: "progressreports"
    },

    html: "Hello, World!!"
});
