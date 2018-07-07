
console.log("Script loaded successfully 55");


Java.perform(function x() {
    //PogoHooks
    var ClientBridge = Java.use("com.nianticlabs.pokemongoplus.bridge.ClientBridge");
    ClientBridge.standaloneSfidaRegister.implementation = function (a, b) {
        var c = this.standaloneSfidaRegister(a, b);
        send('{"Type" : "ClientBridge", "Method" : "standaloneSfidaRegister","Data" : ["' + a.toString() + '", "' + b.toString() + '"]}');
        return c;
    };

    ClientBridge.sendScannedSfida.implementation = function (a, b) {
        var c = this.sendScannedSfida(a, b);
        send('{"Type" : "ClientBridge", "Method" : "sendScannedSfida","Data" : ["'+ a.toString()+'", "'+ b.toString()+'"]}');
        return c;
    };

    ClientBridge.registerDevice.implementation = function (a) {
        var c = this.registerDevice(a);
        send('{"Type" : "ClientBridge", "Method" : "registerDevice","Data" : "' + a + '"}');
        return c;
    };

    ClientBridge.onSfidaRegistered.implementation = function (a, b) {
        var c = this.onSfidaRegistered(a, b);
        send('{"Type" : "ClientBridge", "Method" : "onSfidaRegistered","Data" : ["'+ a.toString()+'", "'+ b.toString()+'"]}');
        return c;
    };


    var BackgroundBridge = Java.use("com.nianticlabs.pokemongoplus.bridge.BackgroundBridge");
    BackgroundBridge.createBridge.implementation = function (a, b) {
        var c = this.createBridge(a, b);
        send('{"Type" : "BackgroundBridge", "Method" : "createBridge","Data" : ["' + a.toString() + '", "' + b.toString() + '"]}');
        return c;
    };

    var actions = [
        'START_ACTION',
        'RESUME_ACTION',
        'PAUSE_ACTION',
        'STOP_ACTION',
        'START_SCANNING_ACTION',
        'STOP_SCANNING_ACTION',
        'START_SESSION_ACTION',
        'SET_PRODUCT_ACTION',
        'STOP_SESSION_ACTION',
        'START_SERVICE_ACTION',
        'SHUTDOWN_ACTION',
        'REQUEST_PGP_STATE',
        'UPDATE_NOTIFICATIONS'
    ];

    BackgroundBridge.onClientMessage.implementation = function (object) {
        var c = this.onClientMessage(object);
        var action = actions[object.getAction().ordinal()];

        send('{"Type" : "BackgroundBridge", "Method" : "onClientMessage","Data" : "' + action + '"}');

        if (action == 'START_SESSION_ACTION') {
            var string2 = object.getHostPort();
            var string3 = object.getDeviceId();
            var arrby = object.getAuthToken();
            var l2 = object.getEncounterId();
            var n2 = object.getNotifications();

            send('{"Type" : "BackgroundBridge", "Method" : "onClientMessage","Data" : ["' + string2 + '", "' + string3 + '", "' + l2 + '", "' + n2 + '"]}', new Uint8Array(arrby));
        }
        else if (action == 'SET_PRODUCT_ACTION') {
            var string4 = object.getProductName();
            var ver = object.getProductVersion();

            send('{"Type" : "BackgroundBridge", "Method" : "onClientMessage","Data" : ["' + string4 + '", "' + ver + '"]}');
        }

        return c;
    };

    // THROWS - Called if already paired only
    // BackgroundBridge.start.implementation = function () {
    //     var c = this.start();
    //     send('{"Type" : "BackgroundBridge", "Method" : "start","Data" : ""}');
    //     return c;
    // }

    // THROWS - Called if already paired only
    // BackgroundBridge.startSession.implementation = function (a, b, c, d, e) {
    //     var c = this.startSession(a, b, c, d, e);
    //     send('{"Type" : "BackgroundBridge", "Method" : "startSession","Data" : ["' + a + '", "' + b + '", "' + c + '", "' + d + '", "' + e + '"]}');
    //     return c;
    // }

    var ClientService = Java.use("com.nianticlabs.pokemongoplus.service.ClientService");
    ClientService.startClientService.implementation = function (context, bridge) {
        var c = this.startClientService(context, bridge);
        send('{"Type" : "ClientService", "Method" : "startClientService", "Data" : ["' + context.toString() + '", "' + bridge.toString() + '"]}');
        return c;
    }

    var BackgroundService = Java.use("com.nianticlabs.pokemongoplus.service.BackgroundService");
    BackgroundService.initBackgroundBridge.implementation = function () {
        var c = this.initBackgroundBridge();
        send('{"Type" : "BackgroundService", "Method" : "initBackgroundBridge", "Data" : ""}');
        return c;
    }

    BackgroundService.sendClientIntent.implementation = function (context, str) {
        var c = this.sendClientIntent(context, str);
        send('{"Type" : "BackgroundService", "Method" : "sendClientIntent", "Data" : ["' + context.toString() + '", "' + str.toString() + '"]}');
        return c;
    }

    var Crypt = Java.use("com.nianticlabs.pokemongoplus.util.Crypt");

    Crypt.encryptNonce.overload("[B", "[B").implementation = function (a, b) {
        //send('{"Type" : "Debug", "Debug" : "============> encryptNonce"}');
        var c = this.encryptNonce.overload("[B", "[B").call(this, a, b);
        //send('{"Type" : "CryptType", "CryptType" : "encryptNonce_Key","Key" : "'+toHexString(new Uint8Array(a))+'"}',new Uint8Array(c));
        send('{"Type" : "CryptType", "CryptType" : "encryptNonce_Key"}', new Uint8Array(a));
        send('{"Type" : "CryptType", "CryptType" : "encryptNonce_Data"}', new Uint8Array(b));
        send('{"Type" : "CryptType", "CryptType" : "encryptNonce_Return"}', new Uint8Array(c));
        return c;
    };

    Crypt.unencryptNonce.overload("[B", "[B").implementation = function (a, b) {
        //send('{"Type" : "Debug", "Debug" : "============> unencryptNonce"}');
        var c = this.unencryptNonce.overload("[B", "[B").call(this, a, b);
        //send('{"Type" : "CryptType", "CryptType" : "unencryptNonce","Key" : "'+toHexString(new Uint8Array(a))+'","Data" : "'+toHexString(new Uint8Array(b))+'"}',new Uint8Array(c));
        send('{"Type" : "CryptType", "CryptType" : "unencryptNonce_Key"}', new Uint8Array(a));
        send('{"Type" : "CryptType", "CryptType" : "unencryptNonce_Data"}', new Uint8Array(b));
        send('{"Type" : "CryptType", "CryptType" : "unencryptNonce_Return"}', new Uint8Array(c));
        return c;
    };

    Crypt.generateNonce.overload().implementation = function () {
        var a = this.generateNonce.overload().call(this);
        send('{"Type" : "CryptType", "CryptType" : "generateNonce"}', new Uint8Array(a));
        return a;
    };

    Crypt.getPersistedByteArray.overload("java.lang.String").implementation = function (a) {
        var b = this.getPersistedByteArray.overload("java.lang.String").call(this, a);
        send('{"Type" : "CryptType", "CryptType" : "getPersistedByteArray", "Preference" :"' + a.toString() + '" }', new Uint8Array(b));
        return b;
    };

    Crypt.persistByteArray.overload("java.lang.String", "[B").implementation = function (a, b) {
        send('{"Type" : "CryptType", "CryptType" : "persistByteArray", "Preference" :"' + a.toString() + '" }', new Uint8Array(b));
        return this.persistByteArray.overload("java.lang.String", "[B").call(this, a, b);
    };

    //Certificate service of pogo (x509TrustManager)
    var NianticTrustManager = Java.use("com.nianticlabs.nia.network.NianticTrustManager");
    NianticTrustManager.checkClientTrusted.overload("[Ljava.security.cert.X509Certificate;", "java.lang.String").implementation = function (a, b) {
        send('{"Type" : "Debug", "Debug" : "============> NianticTrustManager.checkClientTrusted  ' + b.toString() + '"}');
        return this.checkClientTrusted.overload("[Ljava.security.cert.X509Certificate;", "java.lang.String").call(this, a, b);
    };
    NianticTrustManager.checkServerTrusted.overload("[Ljava.security.cert.X509Certificate;", "java.lang.String").implementation = function (a, b) {
        send('{"Type" : "Debug", "Debug" : "============> NianticTrustManager.checkServerTrusted  ' + b.toString() + '"}');
        return this.checkServerTrusted.overload("[Ljava.security.cert.X509Certificate;", "java.lang.String").call(this, a, b);
    };

    //Gatt hooks
    var BluetoothGattCharacteristic = Java.use("android.bluetooth.BluetoothGattCharacteristic");
    BluetoothGattCharacteristic.getValue.overload().implementation = function () {
        var a = this.getValue.overload().call(this);
        send('{"Type" : "Gatt", "Gatt" : "getValue","Characteristic" : "' + this.getUuid().toString() + '" }', new Uint8Array(a));
        return a;
    };
    BluetoothGattCharacteristic.setValue.overload("[B").implementation = function (a) {
        send('{"Type" : "Gatt", "Gatt" : "setValue","Characteristic" : "' + this.getUuid().toString() + '" }', new Uint8Array(a));
        return this.setValue.overload("[B").call(this, a);
    };

    //Log hooks
    var Log = Java.use("android.util.Log");
    Log.d.overload("java.lang.String", "java.lang.String", "java.lang.Throwable").implementation = function (a, b, c) {
        send('{"Type" : "Log", "Log" : "D [' + a.toString() + '] ' + b.toString() + '" }');
        return this.d.overload("java.lang.String", "java.lang.String", "java.lang.Throwable").call(this, a, b, c);
    };
    Log.d.overload("java.lang.String", "java.lang.String").implementation = function (a, b) {
        send('{"Type" : "Log", "Log" : "D [' + a.toString() + '] ' + b.toString() + '" }');
        return this.d.overload("java.lang.String", "java.lang.String").call(this, a, b);
    };

    Log.v.overload("java.lang.String", "java.lang.String", "java.lang.Throwable").implementation = function (a, b, c) {
        send('{"Type" : "Log", "Log" : "V [' + a.toString() + '] ' + b.toString() + '" }');
        return this.v.overload("java.lang.String", "java.lang.String", "java.lang.Throwable").call(this, a, b, c);
    };
    Log.v.overload("java.lang.String", "java.lang.String").implementation = function (a, b) {
        send('{"Type" : "Log", "Log" : "V [' + a.toString() + '] ' + b.toString() + '" }');
        return this.v.overload("java.lang.String", "java.lang.String").call(this, a, b);
    };

    Log.i.overload("java.lang.String", "java.lang.String", "java.lang.Throwable").implementation = function (a, b, c) {
        send('{"Type" : "Log", "Log" : "I [' + a.toString() + '] ' + b.toString() + '" }');
        return this.i.overload("java.lang.String", "java.lang.String", "java.lang.Throwable").call(this, a, b, c);
    };
    Log.i.overload("java.lang.String", "java.lang.String").implementation = function (a, b) {
        send('{"Type" : "Log", "Log" : "I [' + a.toString() + '] ' + b.toString() + '" }');
        return this.i.overload("java.lang.String", "java.lang.String").call(this, a, b);
    };

    Log.e.overload("java.lang.String", "java.lang.String", "java.lang.Throwable").implementation = function (a, b, c) {
        send('{"Type" : "Log", "Log" : "E [' + a.toString() + '] ' + b.toString() + '" }');
        return this.e.overload("java.lang.String", "java.lang.String", "java.lang.Throwable").call(this, a, b, c);
    };
    Log.e.overload("java.lang.String", "java.lang.String").implementation = function (a, b) {
        send('{"Type" : "Log", "Log" : "E [' + a.toString() + '] ' + b.toString() + '" }');
        return this.e.overload("java.lang.String", "java.lang.String").call(this, a, b);
    };

    Log.w.overload("java.lang.String", "java.lang.String", "java.lang.Throwable").implementation = function (a, b, c) {
        send('{"Type" : "Log", "Log" : "W [' + a.toString() + '] ' + b.toString() + '" }');
        return this.w.overload("java.lang.String", "java.lang.String", "java.lang.Throwable").call(this, a, b, c);
    };
    Log.w.overload("java.lang.String", "java.lang.String").implementation = function (a, b) {
        send('{"Type" : "Log", "Log" : "W [' + a.toString() + '] ' + b.toString() + '" }');
        return this.w.overload("java.lang.String", "java.lang.String").call(this, a, b);
    };

    var baseAddres = ptr(Module.findBaseAddress("libNianticLabsPlugin.so"));
    var BackgroundBridge_nativeInit_Offset = ptr("0x001f8cd4");
    var BackgroundBridge_nativeInit = baseAddres.add(BackgroundBridge_nativeInit_Offset).add(1);

    send('{"Type" : "Debug", "Debug" : "libNianticLabsPlugin.so Base: "' + baseAddres + ' + ' + BackgroundBridge_nativeInit_Offset + ' = ' + BackgroundBridge_nativeInit + ' == ' + Module.findExportByName("libNianticLabsPlugin.so","Java_com_nianticlabs_pokemongoplus_bridge_BackgroundBridge_nativeInit"));
    
//    Interceptor.attach(BackgroundBridge_nativeInit, {
//         onEnter: function(args){
//             send('{"Type" : "Debug", "Debug" : "_NativeLibrary Enter Java_com_nianticlabs_pokemongoplus_bridge_BackgroundBridge_nativeInit"');
//         },
//         onLeave: function(retval){
//             send('{"Type" : "Debug", "Debug" : "_NativeLibrary Leave Java_com_nianticlabs_pokemongoplus_bridge_BackgroundBridge_nativeInit"');
//         }
//     });
});
