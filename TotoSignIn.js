import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';

export default class TotoSignIn {

  constructor(clientId) {

    GoogleSignin.configure({
      scopes: [], // what API you want to access on behalf of the user, default is email and profile
      webClientId: clientId, // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      // hostedDomain: '', // specifies a hosted domain restriction
      // forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login
      // accountName: '', // [Android] specifies an account name on the device that should be used
    });

  }

  /**
   * Google Sign in function
   */
  signIn = async () => {
    // Calls Google for the sign in process
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      return userInfo;

    } catch (error) {
      console.log(error);
      console.log(error.code);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('SIGN IN CANCELLED');
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('IN PROGR');
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('SERVICES NOT AVAILABLE');
        // play services not available or outdated
      } else {
        console.log('OTHER');
        // some other error happened
      }
    }
  };

  /**
   * Retrieve the current user info.
   * To be called only if already signed in!
   */
  getCurrentUserInfo = async () => {

    try {
      const userInfo = await GoogleSignin.signInSilently();

      return userInfo;

    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // user has not signed in yet
      } else {
        // some other error
      }
    }
  };

  /**
   * Checks if the user is signed In
   */
  isSignedIn = async () => {

    const isSignedIn = await GoogleSignin.isSignedIn();

    if (isSignedIn) return this.getCurrentUserInfo;

    return false;

  };

  signOut = async () => {

    try {

      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();

      return true;

    } catch (error) {
      console.error(error);
    }
  };

}
