// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {

        StatusBar.hide();

        $("form").submit(function (e) {
            e.preventDefault();
        });

        //getLichessUser();

        $('#createMachineGame-btn').click(createMachineGame);

        $('#createOTBGame-btn').click(createOTBGame);

        $('#refreshButton').click(loadDeviceList);

        $('#disconnectButton').click(disconnectDevice);


        




        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.

        ble.isEnabled(
        function () {
            // Bluetooth is enabled
        },
        function () {
            // Bluetooth not yet enabled so we try to enable it
            ble.enable(
              function () {
                  // bluetooth now enabled
              },
              function (err) {
                  alert('Cannot enable bluetooth');
              }
            );
        }
      );



    };

    window.foreground = true;

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
        foreground = false;
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
        foreground = true;
    };
})();