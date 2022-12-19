<template>

  <body>
    <div>

    </div>
    <div class="container">
      <div class="login-left">
        <div class="login-header">
          <h1>Welcome to e-katanalwsis</h1>
          <p>Create an account to find the best offers in Patras</p>

        </div>
        <form @submit.prevent="submit()" class="login-form">
          <div class="login-form-content">
            <div class="form-item">
              <label for="username">USERNAME</label>
              <input v-model="user.username" type="text" id="username">
            </div>
            <div class="form-item">
              <label for="email">EMAIL</label>
              <input v-model="user.email" type="email" id="email">
            </div>
            <div class="form-item">
              <label for="password">PASSWORD</label>
              <input type="password" v-model="user.password" id="password">
            </div>
            <div class="form-item">
              <label for="password">CONFIRM YOUR PASSWORD</label>
              <input type="password" v-model="user.conf_password" id="conf_password">
            </div>
            <div v-if="passwordError" class="error">
              {{ passwordError }}
            </div>
            <div class="checkbox">
              <input type="checkbox" id="rememberMeCheckbox" checked>
              <label for="rememberMeCheckbox" class="checkboxLabel">Remember Me</label>
            </div>
            <button type="submit" class="submit" value="Register">Sign Up</button>
          </div>

          <footer>
            <p>
              Already have an account? <router-link to="/login" style="color:orangered">Login Now</router-link>
            </p>
          </footer>

        </form>

        {{ user }}
      </div>
      <div class="login-right">
        <img src="./market.png">
      </div>
    </div>
  </body>
</template>

<script setup>



import { ref, computed } from 'vue';
import userState from '../composables/store';
var meetsRequir = false;


const user = ref({
  username: "",
  email: "",
  password: "",
  conf_password: ""
})


const passwordError = computed(() => {
  meetsRequir = false;
  if (user.value.password.length < 8) {
    meetsRequir = false;
    return 'Password must be at least 8 characters long'
  }
  if (!/[A-Z]/.test(user.value.password)) {
    meetsRequir = false;
    return 'Password must contain at least one capital letter'
  }
  if (!/[0-9]/.test(user.value.password)) {
    meetsRequir = false;
    return 'Password must contain at least one number'
  }
  if (!/[^A-Za-z0-9]/.test(user.value.password)) {
    meetsRequir = false;
    return 'Password must contain at least one special character'
  }
  if (user.value.password !== user.value.conf_password) {
    meetsRequir = false;
    return 'Passwords must match'
  }
  else {
    meetsRequir = true; 
    return ''
  }
})

function submit() {
  
  if (!meetsRequir) {
    console.log("error")
    return
  }
  else {
  console.log("submit")
  signup()
  }
}

const signup = async () => {
  try {
    let newUser = {...user.value} // "..." genius copying twn values tou object mesa sto kainourio. 2 object sth mnhmh
    delete newUser.conf_password
    console.log(newUser);
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Accept': 'application/json', //specifies that the client understands JSON format
        'Content-Type': 'application/json'  //format of the request, again in JSON
      },
      body: JSON.stringify(newUser)
    })

    if (response.ok == false) throw response

    const data = await response.json();

    localStorage.setItem('token', data.token)

    console.log(data.token);

    userState.value.loggedIn = true
    console.log(userState.value.loggedIn);
  
    // redirect to home page when the sign up is succesful 
    router.push('/');

    console.log("response!", response)
  } catch (error) {
      //if (response )
    alert(error)
  } 
}





</script>