
console.log("Script loaded successfully [connect-script]");

Java.perform(function() {
    function getHttpUrlConnection() {
		try { // Marshmallow
			return Java.use("com.android.okhttp.internal.huc.HttpURLConnectionImpl");
		}
        catch (e) {
            try {  // KITKAT
                return Java.use("com.android.okhttp.internal.http.HttpURLConnectionImpl");
            }
            catch (e) {
                return Java.use("libcore.net.http.HttpURLConnectionImpl");
            }
		}
    }
    
    // *******************************
    // Disable certificate pinning
    var NianticTrustManager = Java.use("com.nianticlabs.nia.network.NianticTrustManager");
    NianticTrustManager.getAcceptedIssuers.implementation = function () {
        send('{"Type" : "NianticTrustManager", "Method" : "getAcceptedIssuers","Data" : null}');
        return null;
    };

    // *******************************
    // Re-route HTTP queries
    var HttpURLConnectionImpl = getHttpUrlConnection();
    var URL = Java.use("java.net.URL");

    HttpURLConnectionImpl.$init.overload("java.net.URL", "com.android.okhttp.OkHttpClient").implementation = function (url, client) {
        var route = url.toString()
        var redirected = route.replace("https://pgorelease.nianticlabs.com", "http://localhost:3000")

        send('{"Type" : "HttpURLConnectionImpl", "Method" : "$init","Data" : {"from": "' + route + '", "to": "' + redirected + '"}}');

        var newUrl = URL.$new(redirected);
        return this.$init.overload("java.net.URL", "com.android.okhttp.OkHttpClient").call(this, newUrl, client);
    };

    // *******************************
    // Disable SafetyNet
    var SafetyNetService = Java.use("com.nianticlabs.nia.platform.SafetyNetService");
    SafetyNetService.attestResponse.implementation = function(arrby, str) {
        send('{"Type" : "SafetyNetService", "Method" : "attestResponse","Data" : "' + str + '"}', new Uint8Array(arrby));
        return;
    }

    SafetyNetService.checkResult.implementation = function(jSONObject) {
        send('{"Type" : "SafetyNetService", "Method" : "checkResult","Data" : "' + jSONObject + '"}');
        return true;
    }

    SafetyNetService.attest.implementation = function(arrby) {
        send('{"Type" : "SafetyNetService", "Method" : "attest","Data" : null}', new Uint8Array(arrby));
        return;
    }

    SafetyNetService.onConnected.implementation = function(arrby) {
        send('{"Type" : "SafetyNetService", "Method" : "onConnected","Data" : null}');
        SafetyNetService.googleApiState = 0; // Which should be STARTED
        return;
    }
});
