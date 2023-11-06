// import GoogleFit, { BucketUnit, Scopes } from 'react-native-google-fit'
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
// import Fitness from '@ovalmoney/react-native-fitness';

// const permissions = [
//   { kind: Fitness.PermissionKinds.Steps, access: Fitness.PermissionAccesses.Write },
// ];

const GoogleFitScreen: () => JSX.Element = () => {
  const [authResult, setAuthResult] = React.useState<string>('');

  // The list of available scopes inside of src/scopes.js file
  // const options = {
  //   scopes: [
  //     Scopes.FITNESS_ACTIVITY_READ,
  //     Scopes.FITNESS_ACTIVITY_WRITE,
  //     Scopes.FITNESS_BODY_READ,
  //     Scopes.FITNESS_BODY_WRITE,
  //   ],
  // }

  // const opt = {
  //   startDate: "2017-01-01T00:00:17.971Z", // required ISO8601Timestamp
  //   endDate: new Date().toISOString(), // required ISO8601Timestamp
  //   bucketUnit: BucketUnit.DAY, // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
  //   bucketInterval: 1, // optional - default 1. 
  // };

  useEffect(() => {
    console.log('GoogleFitScreen start')

    // Fitness.isAuthorized(permissions)
    //   .then((authorized) => {
    //     console.log('Fitness.isAuthorized', authorized)
    //   })
    //   .catch((error) => {
    //     console.log('Fitness.isAuthorized error', error)
    //   });

    // Fitness.requestPermissions([{ kind: permissions[0].kind, access: permissions[0].access }])
    //   .then((authorized) => {
    //     console.log('Fitness.requestPermissions', authorized)
    //   })
    //   .catch((error) => {
    //     console.log('Fitness.requestPermissions error', error)
    //   });

    // GoogleFit.checkIsAuthorized().then(() => {
    //   console.log(GoogleFit.isAuthorized) // Then you can simply refer to `GoogleFit.isAuthorized` boolean.
    // })

    // GoogleFit.authorize(options)
    //   .then(authResult => {
    //     if (authResult.success) {
    //       // dispatch("AUTH_SUCCESS");
    //       console.log('AUTH_SUCCESS')
    //     } else {
    //       // dispatch("AUTH_DENIED", authResult.message);
    //       console.log('AUTH_DENIED')
    //     }
    //   })
    //   .catch(() => {
    //     // dispatch("AUTH_ERROR");
    //     console.log('AUTH_ERROR')
    //   })
  }, [])

  useEffect(() => {
    if (authResult === '') return;

    console.log('GoogleFitScreen authResult', authResult)

    // ...
    // Call when authorized
    // GoogleFit.startRecording((callback) => {
    //   // Process data from Google Fit Recording API (no google fit app needed)
    // });

    // GoogleFit.getDailyStepCountSamples(opt)
    //   .then((res) => {
    //     console.log('Daily steps >>> ', res)
    //   })
    //   .catch((err) => { console.warn(err) });

    // shortcut functions, 
    // return weekly or daily steps of given date
    // all params are optional, using new Date() without given date, 
    // adjustment is 0 by default, determine the first day of week, 0 == Sunday, 1==Monday, etc.
    // GoogleFit.getDailySteps(date).then().catch()
    // GoogleFit.getWeeklySteps(date, adjustment).then().catch()
  }, [authResult])

  return (
    <SafeAreaView style={{ height: '100%' }}>

    </SafeAreaView>
  );
};

export default GoogleFitScreen;