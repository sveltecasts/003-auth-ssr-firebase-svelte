<script>
  import { stores } from "@sapper/app";
  const { session } = stores();
  import { onMount } from "svelte";
  import { tick } from "svelte";
  onMount(() => {
    if (!$session.currentUser) {
      createLoginButton();
    }
  });
  function createLoginButton() {
    // FirebaseUI config.
    var uiConfig = {
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ],
      callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          return false;
        }
      }
    };

    // Initialize the FirebaseUI Widget using Firebase.
    var ui =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebase.auth());
    // The start method will wait until the DOM is loaded.
    ui.start("#firebaseui-auth-container", uiConfig);
  }
  function signOut() {
    firebase
      .auth()
      .signOut()
      .then(async function() {
        // Sign-out successful.
        console.log("logged out");
        await tick();
        createLoginButton();
      })
      .catch(function(error) {
        // An error happened.
        alert(error);
      });
  }
</script>

{#if $session.currentUser}
  <button
    on:click={() => {
      signOut();
    }}>
    Logout
  </button>
{:else}
  <div id="firebaseui-auth-container" />
{/if}
