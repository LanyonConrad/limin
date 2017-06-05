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

        loadDeviceList();

        $('#createMachineGame-btn').click(createMachineGame);

        $('#createOTBGame-btn').click(createOTBGame);

        setInterval(function () { $("#heighter").html(window.innerHeight) },1000);

        window.addEventListener('native.keyboardshow', keyboardShowHandler);
        function keyboardShowHandler(e) { // fired when keyboard enabled
            window.keyboardHeight = e.keyboardHeight;
            document.getElementById("offsetter").style.height = keyboardHeight + "px";
            //scrollBy(0, keyboardHeight);
        }

        window.addEventListener('native.keyboardhide', keyboardHideHandler);
        function keyboardHideHandler(e) { // fired when keyboard disabled
            //scrollBy(0, -keyboardHeight)
            document.getElementById("offsetter").style.height = 0 + "px";
            AndroidFullScreen.immersiveMode();
        }

        
    


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