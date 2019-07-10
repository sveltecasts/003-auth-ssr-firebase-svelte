<script>
  import { onMount } from "svelte";
  import { stores } from "@sapper/app";
  const { session } = stores();
  onMount(() => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        console.log("user", user);
        //currentUser.set(user);
        session.update(currentStore => {
          currentStore.currentUser = user;
          return currentStore;
        });
        user.getIdToken().then(idToken => {
          sendTokenToServer(idToken, "csrf!!LATER");
        });
      } else {
        //currentUser.set(null);
        session.update(currentStore => {
          currentStore.currentUser = null;
          return currentStore;
        });
        clearCookiesOnServer("csrf!!LATER");
        //
        console.log("User is signed out.");
        // ...
      }
    });
  });

  async function clearCookiesOnServer(csrfToken) {
    const rawResponse = await fetch("/auth/clear_cookie", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ csrfToken: csrfToken })
    });
    console.log("POST /auth/clear_cookie", rawResponse.status);
  }
  async function sendTokenToServer(idToken, csrfToken) {
    const rawResponse = await fetch("/auth/session", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ idToken: idToken, csrfToken: csrfToken })
    });
    console.log("POST /auth/session", rawResponse.status);
  }
</script>
