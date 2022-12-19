<template>
    <body>
      <div class="container">
        <div class="login-left">
          <div class="login-header">
            <h1>Welcome to e-katanalwsis</h1>
            <p>Login or create an account to find the best offers in Patras</p>
          </div>
          <form @submit.prevent="signin()" class="login-form">
            <div class="login-form-content">
              <div class = "form-item">
                <label for="username">USERNAME</label>
                <input v-model="user.username" type="text" id="email"> 
              </div>
              <div class="form-item">
                <label for="password">PASSWORD</label>
                <input type="password" v-model="user.password" id="password"> 
              </div>
              <div class="checkbox">
                <input type="checkbox" id="rememberMeCheckbox" checked> 
                <label for="rememberMeCheckbox" class="checkboxLabel">Remember Me</label>        
              </div>
              <button type = "submit" class="submit" value="Login">Sign In</button>
            </div>

            <footer>
                 <p>
                    Don't have an account? <router-link to="/register" style="color:orangered">Register Now</router-link>
                </p>
            </footer>
            
          </form>

          {{ user }}
          {{ userState }}
        </div>
        <div class="login-right">
          <img src="./market.png">
        </div>
      </div>
    </body>  
    </template>
<script setup>
    import { ref } from 'vue';
    import userState from '../composables/store.js'
    import { useRouter } from 'vue-router';
    const router = useRouter();
    const user = ref({ username: "", password: "" })

    const signin = async () => {
    console.log(user.value)

    try {
    const response = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
    },
    body: JSON.stringify(user.value)
    }) 

    if(response.ok == false) throw response.statusText

    const data = await response.json();
    
    localStorage.setItem('token', data.token)
    localStorage.setItem('userID', data.userID)

    console.log(data.token);

    userState.value.loggedIn = true
    console.log("testing")
    router.push('/');


    console.log("response!",response)
    } catch (error){
      alert(error)
    } 
    

}

</script>