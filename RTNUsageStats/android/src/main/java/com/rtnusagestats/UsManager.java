package com.rtnusagestats;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.os.Build;
import android.Manifest;
import android.content.pm.PackageManager;
import android.app.Activity;
import android.util.Log;
import android.content.Context;
import android.content.Intent;
import android.provider.Settings;

import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import java.util.Calendar;
import java.util.List;

class UsManager extends ReactContextBaseJavaModule implements ActivityEventListener {
  private Context context;
  private ReactApplicationContext reactContext;
  private UsageStatsManager usageStatsManager;
  public static final String LOG_TAG = "ReactNativeUsManager";

  public ReactApplicationContext getReactContext() {
    return reactContext;
  }

  public UsManager(ReactApplicationContext reactContext) {
    super(reactContext);
    context = reactContext;
    this.reactContext = reactContext;
    reactContext.addActivityEventListener(this);
    Log.d(LOG_TAG, "UsManager created");
  }

  @Override
  public void onNewIntent(Intent intent) {

  }

  @Override
  public String getName() {
    return "UsManager";
  }

  private UsageStatsManager getUsageStatsManager() {
    if (usageStatsManager == null) {
      usageStatsManager = (UsageStatsManager) context.getSystemService(Context.USAGE_STATS_SERVICE);
    }
    return usageStatsManager;
  }

  public void enableUsageStats(Promise promise) {
    // Todo: Check if permission enabled
    Intent intent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    getReactContext().startActivity(intent);

    // if( Build.VERSION.SDK_INT >= Build.VERSION_CODES.S &&
    // ContextCompat.checkSelfPermission(reactContext,Manifest.permission.BLUETOOTH_CONNECT)
    // != PackageManager.PERMISSION_GRANTED ){

    // if (ContextCompat.checkSelfPermission(reactContext,
    //     Manifest.permission.PACKAGE_USAGE_STATS) != PackageManager.PERMISSION_GRANTED) {
    //   ActivityCompat.requestPermissions(getCurrentActivity(), new String[] { Manifest.permission.PACKAGE_USAGE_STATS },
    //       1);
    // } else {
    //   promise.resolve("default case");
    // }
  }

  @Override
  public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
    Log.d(LOG_TAG, "onActivityResult called " + requestCode);
  }

  public void getTodayUsageStats(Promise promise) {
    Calendar calendar = Calendar.getInstance();
    long endTime = calendar.getTimeInMillis();
    calendar.add(Calendar.DAY_OF_YEAR, -1);
    long startTime = calendar.getTimeInMillis();

    List<UsageStats> usageStatsList = getUsageStatsManager().queryUsageStats(UsageStatsManager.INTERVAL_DAILY, startTime, endTime);
    
    WritableArray array = new WritableNativeArray();
    for (UsageStats usageStats : usageStatsList) {
        if (usageStats.getTotalTimeInForeground() == 0) continue;
        
        WritableMap map = new WritableNativeMap();
        map.putString("packageName", usageStats.getPackageName());
        map.putDouble("totalTimeInForeground", usageStats.getTotalTimeInForeground());
        array.pushMap(map);
    }
    promise.resolve(array);
  }

  public void getRangeUsageStats(long startTime, long endTime, Promise promise) {
    List<UsageStats> usageStatsList = getUsageStatsManager().queryUsageStats(UsageStatsManager.INTERVAL_BEST, startTime, endTime);
    
    WritableArray array = new WritableNativeArray();
    for (UsageStats usageStats : usageStatsList) {
        if (usageStats.getTotalTimeInForeground() == 0) continue;
        
        WritableMap map = new WritableNativeMap();
        map.putString("packageName", usageStats.getPackageName());
        map.putDouble("totalTimeInForeground", usageStats.getTotalTimeInForeground());
        array.pushMap(map);
    }
    promise.resolve(array);
  }
}
