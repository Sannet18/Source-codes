<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import NavBar from './NavBar.vue'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const username = ref('')
const password = ref('')

const errorMessage = ref('')
function login() {
  try {
    userStore.login(username.value, password.value)
    router.push('/home')
  } catch (err) {
    errorMessage.value = '*Username or Password incorrect'
  }
}

const showPassword = ref(false)
</script>

<template>
  <NavBar />
  <div class="login-view view">
    <div class="login-content">
      <div class="login-form">
        <h3>Sign In</h3>
        <div>
          <div class="form-item">
            <label class="usernameInput" for="usernameInput">Username</label>
            <input id="usernameInput" v-model="username" />
          </div>
          <div class="form-item">
            <label class="passwordInput" for="passwordInput">Password</label>
            <label class="switch align-right">
              <input type="checkbox" v-model="showPassword" />
              <span class="slider"></span>
            </label>
            <input
              :type="showPassword ? 'text' : 'password'"
              id="passwordInput"
              v-model="password"
              @keyup.enter="login"
            />
          </div>
        </div>
        <span class="error-message"> {{ errorMessage }}</span>
        <button @click="login">Sign In</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-message {
  color: red;
}
li::marker {
  display: list-item;
  unicode-bidi: isolate;
  font-variant-numeric: tabular-nums;
  text-transform: none;
  text-indent: 0px !important;
  text-align: start !important;
  text-align-last: auto !important;
}
.login-content {
  display: flex;
  justify-content: center;
  gap: 20px;
}
ul {
  padding-left: 15px;
  margin: 3px 0 10px;
}
input:checked + .slider:before {
  transform: translate(13px);
}
input:checked + .slider {
  background-color: #3f3f41;
}
.slider::before {
  position: absolute;
  content: '';
  height: 13px;
  width: 14px;
  left: 2px;
  bottom: 2px;
  background-color: #fff;
  transition: 0.4s;
  border-radius: 50%;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 34px;
}
.login-form > button {
  text-align: center;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 40px;
  border-radius: 999px;
  border: none;
  padding: 10px;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  background-color: #222831;
  color: white;
}

.login-form > button:active {
  transform: scale(97%);
}

.align-right {
  float: right;
}
.switch {
  position: relative;
  display: inline-block;
  width: 30px;
  height: 17px;
}
label {
  cursor: default;
}
.form-item > label {
  display: inline-block;
  margin-bottom: 5px;
}
.form-item > input {
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 5px;

  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.form-item {
  box-sizing: border-box;
  width: 160px;
  margin-bottom: 5px;
}
.login-form h3 {
  text-align: center;
}
.login-form {
  background-color: #f8f8f8;
  box-sizing: border-box;
  padding: 20px;
  font-size: small;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 200px;
  border-radius: 15px;
}
.login-view {
  flex: 1;
  background-color: #efeded;
  opacity: 97%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.no-width {
  width: 0;
}
</style>
