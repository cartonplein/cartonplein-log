<template>
    <div id="login">
        <transition name="fade">
            <div v-if="performingRequest" class="loading">
                <p><span v-html="welcomePage.msg.loading"></span></p>
            </div>
        </transition>
        <section>
            <div class="col1">
                <h1><span v-html="welcomePage.msg.title"></span></h1>
                <p><span v-html="welcomePage.msg.text"></span></p>
            </div>
            <div class="col2" :class="{ 'signup-form': !showLoginForm && !showForgotPassword }">
                <form v-if="showLoginForm" @submit.prevent>
                    <h1>Heureux de vous revoir</h1>

                    <label for="email1">M&eacute;l</label>
                    <input v-model.trim="loginForm.email" type="text" placeholder="vous@email.com" id="email1" />

                    <label for="password1">Mot de passe</label>
                    <input v-model.trim="loginForm.password" type="password" placeholder="******" id="password1" />

                    <button @click="login" class="button">En selle !</button>

                    <div class="extras">
                        <a @click="togglePasswordReset">Mot de passe oubli&eacute;</a>
                        <a @click="toggleForm">Cr&eacute;er un compte</a>
                    </div>
                </form>
                <form v-if="!showLoginForm && !showForgotPassword" @submit.prevent>
                    <h1>Pr&ecirc;t à rouler ?</h1>

                    <label for="firstname">Pr&eacute;nom</label>
                    <input v-model.trim="signupForm.firstname" type="text" placeholder="Prénom" id="firstname" />

                    <label for="lastname">Nom</label>
                    <input v-model.trim="signupForm.lastname" type="text" placeholder="Nom" id="lastname" />

                    <label for="email2">M&eacute;l</label>
                    <input v-model.trim="signupForm.email" type="text" placeholder="vous@email.com" id="email2" />

                    <label for="password2">Mot de passe</label>
                    <input v-model.trim="signupForm.password" type="password" placeholder="min. 6 caractères" id="password2" />

                    <button @click="signup" class="button">C'est parti !</button>

                    <div class="extras">
                        <a @click="toggleForm">Retour</a>
                    </div>
                </form>
                <form v-if="showForgotPassword" @submit.prevent class="password-reset">
                    <div v-if="!passwordResetSuccess">
                        <h1>Mot de passe oubli&eacute;</h1>
                        <p>Vous recevrez un lien pour mettre &agrave; jour votre mot de passe</p>

                        <label for="email3">M&eacute;l</label>
                        <input v-model.trim="passwordForm.email" type="text" placeholder="vous@email.com" id="email3" />

                        <button @click="resetPassword" class="button">Envoyer</button>

                        <div class="extras">
                            <a @click="togglePasswordReset">Retour</a>
                        </div>
                    </div>
                    <div v-else>
                        <h1>Message envoy&eacute;</h1>
                        <p>Consultez vos m&eacute;ls pour mettre &agrave; jour votre mot de passe</p>
                        <button @click="togglePasswordReset" class="button">Retour</button>
                    </div>
                </form>
                <transition name="fade">
                    <div v-if="errorMsg !== ''" class="error-msg">
                        <p>{{ errorMsg }}</p>
                    </div>
                </transition>
            </div>
        </section>
    </div>
</template>

<script>
    const fb = require('../firebaseConfig.js')
    import * as msg from '../messageConfig.js'

    export default {
        data() {
            return {
                welcomePage: {
                    msg: msg.welcome,
                },
                loginForm: {
                    msg: msg.login,
                    email: '',
                    password: ''
                },
                signupForm: {
                    firstname: '',
                    lastname: '',
                    email: '',
                    password: ''
                },
                passwordForm: {
                    email: ''
                },
                showLoginForm: true,
                showForgotPassword: false,
                passwordResetSuccess: false,
                performingRequest: false,
                errorMsg: ''
            }
        },
        methods: {
            toggleForm() {
                this.errorMsg = ''
                this.showLoginForm = !this.showLoginForm
            },
            togglePasswordReset() {
                if (this.showForgotPassword) {
                    this.showLoginForm = true
                    this.showForgotPassword = false
                    this.passwordResetSuccess = false
                } else {
                    this.showLoginForm = false
                    this.showForgotPassword = true
                }
            },
            login() {
                this.performingRequest = true

                fb.auth.signInWithEmailAndPassword(this.loginForm.email, this.loginForm.password).then(user => {
                    this.$store.commit('setCurrentUser', user.user)
                    this.$store.dispatch('fetchUserProfile')
                    this.performingRequest = false
                    this.$router.push('/dashboard')
                }).catch(err => {
                    console.log(err)
                    this.performingRequest = false
                    this.errorMsg = err.message
                })
            },
            signup() {
                this.performingRequest = true

                fb.auth.createUserWithEmailAndPassword(this.signupForm.email, this.signupForm.password).then(user => {
                    this.$store.commit('setCurrentUser', user.user)

                    // create user obj
                    fb.usersCollection.doc(user.user.uid).set({
                        firstname: this.signupForm.firstname,
                        lastname: this.signupForm.lastname,
                    }).then(() => {
                        this.$store.dispatch('fetchUserProfile')
                        this.performingRequest = false
                        this.$router.push('/dashboard')
                    }).catch(err => {
                        console.log(err)
                        this.performingRequest = false
                        this.errorMsg = err.message
                    })
                }).catch(err => {
                    console.log(err)
                    this.performingRequest = false
                    this.errorMsg = err.message
                })
            },
            resetPassword() {
                this.performingRequest = true

                fb.auth.sendPasswordResetEmail(this.passwordForm.email).then(() => {
                    this.performingRequest = false
                    this.passwordResetSuccess = true
                    this.passwordForm.email = ''
                }).catch(err => {
                    console.log(err)
                    this.performingRequest = false
                    this.errorMsg = err.message
                })
            }
        }
    }
</script>
