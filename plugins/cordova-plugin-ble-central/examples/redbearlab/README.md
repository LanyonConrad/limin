## RedBearLab UART

UART example using an Arduino and [RedBear Lab's Bluetooth Shield](https://redbearlab.com/bleshield/) or any of the RedBear Lab boards: [Blend](https://redbearlab.com/blend/), [Blend Micro](https://redbearlab.com/blendmicro/), [nRF51822](https://redbearlab.com/redbearlab-nrf51822/), or [BLE Nano](https://redbearlab.com/blenano/).

Use the [SimpleChat sketch](https://codebender.cc/sketch:37518) on your Arduino hardware.

Hardware

 * [Arduino Uno](https://www.makershed.com/products/arduino-uno-revision-3)
 * [BLE Shield](https://www.makershed.com/products/bluetooth-low-energy-ble-shield-for-arduino-2-0)

Install

    $ cordova platform add android ios
    $ cordova plugin add cordova-plugin-ble-central
    $ cordova run

Once the app is running. Open the serial console to your Arduino. Data sent from the phone will show up in the serial console. Data sent from the Arduino will show up in on the phone.
