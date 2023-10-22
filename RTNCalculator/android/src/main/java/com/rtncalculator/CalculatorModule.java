package com.rtncalculator;

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

import java.util.HashMap;
import com.rtncalculator.NativeCalculatorSpec;
import android.util.Log;

public class CalculatorModule extends NativeCalculatorSpec {

    public static String NAME = "RTNCalculator";

    CalculatorModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    @Override
    public void add(double a, double b, Promise promise) {
        promise.resolve(a + b);
    }

    @Override
    public void checkEquals(double a, double b, Promise promise) {
        promise.resolve(a == b);
    }

    // Return fibonacci list
    private int fib(int n) {
        if (n <= 1) return n;
        else return fib(n-1) + fib(n-2);
    }

    @Override
    public void fibonacci(double n, Callback callBack) {
        WritableArray fibs = new WritableNativeArray();
        for (int i = 0; i < n; i++) {
            fibs.pushInt(fib(i));
        }
        Log.d("fibonacci", "fibonacci: " + fibs);
        callBack.invoke(null, fibs);
    }
}