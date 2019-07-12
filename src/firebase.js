
var admin = require("firebase-admin");
import serviceAccount from './sapper-auth-firebase-adminsdk-j9stc-63a9fd63f2'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sapper-auth.firebaseio.com"
});
export default admin;
