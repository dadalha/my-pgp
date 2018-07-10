
console.log("Script loaded successfully [fake-no-emulator]");

Java.perform(function() {
    var Debug = Java.use("android.os.Debug");
    Debug.isDebuggerConnected.implementation = function() {
        return false;
    }

    var TelephonyManager = Java.use("android.telephony.TelephonyManager");
    TelephonyManager.getDeviceId.overload().implementation = function() {
        return "012322678945345";
    }
    TelephonyManager.getDeviceId.overload("int").implementation = function(slot) {
        return "012322678945345";
    }

    var System = Java.use("java.lang.System");
    var String = Java.use("java.lang.String");
    System.getProperty.overload("java.lang.String").implementation = function(key) {
        if (key.indexOf('version') >= 0) return String.$new("21");
        if (key.indexOf("manufacturer") >= 0) return String.$new("xiaomi");
        if (key.indexOf("model") >= 0) return String.$new("redmi note 2");
        if (key.indexOf("product") >= 0) return String.$new("redmi note 2");
        return this.getProperty.overload("java.lang.String").call(this, key);
    }
    System.getProperty.overload("java.lang.String", "java.lang.String").implementation = function(key, def) {
        console.log(key);
        if (key.indexOf('version') >= 0) return String.$new("21");
        if (key.indexOf("manufacturer") >= 0) return String.$new("xiaomi");
        if (key.indexOf("model") >= 0) return String.$new("redmi note 2");
        if (key.indexOf("product") >= 0) return String.$new("redmi note 2");
        return this.getProperty.overload("java.lang.String", "java.lang.String").call(this, key, def);
    }

    // Does this really work??
    var Build = Java.use("android.os.Build");
    Build.MODEL = String.$new("Redmi Note 2");
    Build.MANUFACTURER = String.$new("XiaoMi");
    Build.PRODUCT = String.$new("beta1");
});
