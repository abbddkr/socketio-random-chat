<script lang="ts">
import api from "@/helpers/api";
import { defineComponent } from "@vue/runtime-core";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
export default defineComponent({
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  components: {},
  props: {},
  data() {
    return {
      form: {
        gender: "",
      },
    };
  },
  validations: {
    form: {
      nickname: {
        required,
      },
    },
  },
  methods: {
    validateState(name: string) {
      const { $dirty, $error } = this.v$.form[name];
      return $dirty ? !$error : null;
    },
    async guestLogin() {
      try {
        this.v$.form.$touch();
        if (this.v$.form.$anyError) {
          console.error("Form is not validated!");
        } else {
          const res = await api.post("/chat/guest", this.form);
          if (res.data) {
            localStorage.setItem("user", JSON.stringify(res.data));
            this.$router.push({ path: "/chat/random-chat" });
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
});
</script>
<template>
  <b-row>
    <b-col>
      <h1>Login as a Guest</h1>
      <div class="row">
        <div class="col-md-6">
          <h3>Chat With Strangers</h3>
          <hr />
          <p style="line-height: 1.9">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Inventore
            ipsum alias voluptas magnam. Quasi, recusandae in sint, a repellat
            ullam dolores reprehenderit eum reiciendis id quia consequuntur
            itaque voluptatibus assumenda. Lorem, ipsum dolor sit amet
            consectetur adipisicing elit. Inventore ipsum alias voluptas magnam.
            Quasi, recusandae in sint, a repellat ullam dolores reprehenderit
            eum reiciendis id quia consequuntur itaque voluptatibus assumenda.
          </p>
        </div>
        <div class="col-md-6">
          <b-card title="Login" class="mb-2 my-3" style="max-width: 100%">
            <b-form @submit.stop.prevent="guestLogin">
              <b-form-group label="Nickname">
                <b-form-input
                  :state="validateState('nickname')"
                  v-model="v$.form.nickname.$model"
                  placeholder="(e.g: Postmaan1)"
                  size="sm"
                ></b-form-input>
                <b-form-invalid-feedback id="live-error"
                  >This is a required field
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label="Gender">
                <b-form-radio
                  v-model="form.gender"
                  name="gender-radio"
                  value="male"
                >
                  Male
                </b-form-radio>
                <b-form-radio
                  v-model="form.gender"
                  name="gender-radio"
                  value="female"
                >
                  Female
                </b-form-radio>
              </b-form-group>
              <b-form-group class="mt-3">
                <b-button type="submit" size="sm" variant="secondary"
                  >Enter the Chat
                </b-button>
              </b-form-group>
            </b-form>
          </b-card>
        </div>
      </div>
    </b-col>
  </b-row>
</template>
<style></style>
