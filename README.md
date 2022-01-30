# **IQ96**

React Native app for easy communication and info accesss for a group of people

* react native
* firebase
* google maps

### **building**

For building use:

> npm run build

This is for linux mint. It will open up a window using _nemo_.

### **Versioning**

To change App bundle and versionnumber values, you need to edit

    ./android/app/build.gradle
    ./package.json

### **Gitignored files with API keys**
* android/app/src/main/**AndroidManifest.xml**
  
Find google maps key [Link to Google cloud page](https://console.cloud.google.com/apis/credentials)

    <manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.iq96">

        <uses-permission android:name="android.permission.INTERNET" />
        <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

        <application android:name=".MainApplication" android:label="@string/app_name" android:icon="@mipmap/ic_launcher" android:roundIcon="@mipmap/ic_launcher_round" android:allowBackup="false" android:theme="@style/AppTheme">
            <activity android:name=".MainActivity" android:label="@string/app_name" android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode" android:launchMode="singleTask" android:windowSoftInputMode="adjustResize">
                <intent-filter>
                    <action android:name="android.intent.action.MAIN" />
                    <category android:name="android.intent.category.LAUNCHER" />
                </intent-filter>
            </activity>
            <meta-data android:name="com.google.android.geo.API_KEY" android:value="API_-_KEY HERE" />
            <uses-library android:name="org.apache.http.legacy" android:required="false"/>
        </application>
    </manifest>

 * src/utils/**firebaseConfig.js**
  
Find info on firebase

    export const firebaseConfig = {
    apiKey: 'apiKey',
    authDomain: 'authDomain',
    databaseURL:
    'databaseURL',
    projectId: 'projectId',
    storageBucket: 'storageBucket',
    messagingSenderId: 'messagingSenderId',
    appId: 'appId',
    };
