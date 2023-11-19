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
import androidx.annotation.NonNull;

import java.util.Calendar;
import java.util.List;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager.NameNotFoundException;
import android.content.res.Resources;
import android.graphics.drawable.Drawable;
import android.content.pm.ApplicationInfo;
import android.util.Base64;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.io.ByteArrayOutputStream;
import android.util.DisplayMetrics;
import android.graphics.Canvas;

class UsManager extends ReactContextBaseJavaModule implements ActivityEventListener {
  private Context context;
  private ReactApplicationContext reactContext;
  private UsageStatsManager usageStatsManager;
  public static final String LOG_TAG = "ReactNativeUsManager";
  private static PackageManager pm;

  public ReactApplicationContext getReactContext() {
    return reactContext;
  }

  public UsManager(ReactApplicationContext reactContext) {
    super(reactContext);
    context = reactContext;
    this.reactContext = reactContext;
    reactContext.addActivityEventListener(this);
    pm = reactContext.getPackageManager();
  }

  private static String getAppNameByPackageName(String packageName) {
    try {
      PackageInfo pi = pm.getPackageInfo(packageName, 0);
      return pi.applicationInfo.loadLabel(pm).toString();
    } catch (Exception e) {
      // Handle Error here
      Log.d(LOG_TAG, e.getMessage());
      return "";
    }
  }

  public static Drawable getIconFromPackageName(String packageName, Context context) {// from ww w . j a v a 2s . c om
    PackageManager pm = context.getPackageManager();
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.ICE_CREAM_SANDWICH_MR1) {
      try {
        PackageInfo pi = pm.getPackageInfo(packageName, 0);
        Context otherAppCtx = context.createPackageContext(
            packageName, Context.CONTEXT_IGNORE_SECURITY);

        int displayMetrics[] = { DisplayMetrics.DENSITY_XHIGH,
            DisplayMetrics.DENSITY_HIGH,
            DisplayMetrics.DENSITY_TV };

        for (int displayMetric : displayMetrics) {
          try {
            Drawable d = otherAppCtx.getResources()
                .getDrawableForDensity(
                    pi.applicationInfo.icon,
                    displayMetric);
            if (d != null) {
              return d;
            }
          } catch (Resources.NotFoundException e) {
            continue;
          }
        }

      } catch (Exception e) {
        // Handle Error here
      }
    }

    ApplicationInfo appInfo = null;
    try {
      appInfo = pm.getApplicationInfo(packageName,
          PackageManager.GET_META_DATA);
    } catch (PackageManager.NameNotFoundException e) {
      return null;
    }

    return appInfo.loadIcon(pm);
  }

  @NonNull
  private Bitmap getBitmapFromDrawable(@NonNull Drawable drawable) {
    final Bitmap bmp = Bitmap.createBitmap(drawable.getIntrinsicWidth(), drawable.getIntrinsicHeight(),
        Bitmap.Config.ARGB_8888);
    final Canvas canvas = new Canvas(bmp);
    drawable.setBounds(0, 0, canvas.getWidth(), canvas.getHeight());
    drawable.draw(canvas);
    return bmp;
  }

  private String encodeDrawable(Drawable d) {
    String encoded = "";

    Bitmap bitmap = getBitmapFromDrawable(d);
    ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
    bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
    byte[] byteArray = byteArrayOutputStream.toByteArray();
    encoded = Base64.encodeToString(byteArray, Base64.DEFAULT);

    return encoded;
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
    // Manifest.permission.PACKAGE_USAGE_STATS) !=
    // PackageManager.PERMISSION_GRANTED) {
    // ActivityCompat.requestPermissions(getCurrentActivity(), new String[] {
    // Manifest.permission.PACKAGE_USAGE_STATS },
    // 1);
    // } else {
    // promise.resolve("default case");
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

    List<UsageStats> usageStatsList = getUsageStatsManager().queryUsageStats(UsageStatsManager.INTERVAL_DAILY,
        startTime, endTime);

    WritableArray array = new WritableNativeArray();
    for (UsageStats usageStats : usageStatsList) {
      if (usageStats.getTotalTimeInForeground() == 0)
        continue;

      WritableMap map = new WritableNativeMap();
      map.putString("packageName", usageStats.getPackageName());
      map.putDouble("totalTimeInForeground", usageStats.getTotalTimeInForeground());
      array.pushMap(map);
    }
    promise.resolve(array);
  }

  public void getRangeUsageStats(long startTime, long endTime, Promise promise) {
    List<UsageStats> usageStatsList = getUsageStatsManager().queryUsageStats(UsageStatsManager.INTERVAL_BEST, startTime,
        endTime);

    WritableArray array = new WritableNativeArray();
    for (UsageStats usageStats : usageStatsList) {
      if (usageStats.getTotalTimeInForeground() == 0)
        continue;

      WritableMap map = new WritableNativeMap();

      WritableMap appInfo = new WritableNativeMap();
      appInfo.putString("packageName", usageStats.getPackageName());
      appInfo.putString("name", getAppNameByPackageName(usageStats.getPackageName()));
      Drawable d = getIconFromPackageName(usageStats.getPackageName(), reactContext);
      Log.d(LOG_TAG, "Drawable: " + d);
      if (d == null) {
        appInfo.putString("icon", "");
      } else {
        String encoded = encodeDrawable(d);
        appInfo.putString("icon", encoded);
      }
      map.putMap("appInfo", appInfo);

      map.putDouble("totalTimeInForeground", usageStats.getTotalTimeInForeground());
      array.pushMap(map);
    }
    promise.resolve(array);
  }
}
