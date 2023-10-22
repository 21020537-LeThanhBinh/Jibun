package com.rtnusagestats;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import java.util.HashMap;
import com.rtnusagestats.NativeUsageStatsSpec;
import android.util.Log;

import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.os.Build;
import android.widget.Toast;

import androidx.annotation.RequiresApi;

import java.util.Calendar;
import java.util.List;

import android.content.Intent;
import android.provider.Settings;

@RequiresApi(api = Build.VERSION_CODES.LOLLIPOP_MR1)
public class UsageStatsModule extends NativeUsageStatsSpec {

    public static String NAME = "RTNUsageStats";
    private static ReactApplicationContext reactContext;
    final private UsManager usManager;
    public static final String LOG_TAG = "ReactNativeUsageStatsModule";

    UsageStatsModule(ReactApplicationContext context) {
        super(context);
        usManager = new UsManager(context);
        reactContext = context;
        Log.d(LOG_TAG, "UsageStatsModule created");
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    @Override
    public void enableUsageStats(Promise promise) {
       usManager.enableUsageStats(promise);
    }

    @Override
    public void getTodayUsageStats(Promise promise) {
        usManager.getTodayUsageStats(promise);
    }

    @Override
    public void getRangeUsageStats(String startTimeMiliStr, String endTimeMiliStr, Promise promise) {
        long startTime = Long.parseLong(startTimeMiliStr);
        long endTime = Long.parseLong(endTimeMiliStr);
        usManager.getRangeUsageStats(startTime, endTime, promise);
    }
}