<template>
  <div class="component-wrapper container">
    <main-header navsel="front"></main-header>
    <div v-if="ticket">
      <div class="hero">
        <img src="@/assets/logo.png" class="logo" style="float:left" />
        <h1>ซื้อตั๋วได้เลยครับ</h1>
        <p>By Gooddev.ME</p>
      </div>
      <div class="ticket-wrapper" v-if="ticket != null">
        <h1>{{ ticket.title }}</h1>
        <p>
          <strong>Category:</strong>:
          <a
            href="#"
            v-on:click.prevent="navigateTo(`/front?search=${ticket.category}`)"
          >{{ticketk.category }}</a>
        </p>
        <div class="content" v-html="ticket.content"></div>
        <!-- <p>category: {{ ticket.category }}</p>
        <p>status: {{ ticket.status }}</p>-->
      </div>
      <div class="back-nav">
        <button class="btn btn-success" v-on:click="navigateTo('/front-tickets')">
          <i class="fas fa-arrow-left"></i> Back..
        </button>
      </div>
      <br />
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import TicketsService from "@/services/TicketsService";
import UsersService from "@/services/UsersService";
import CommentComp from "@/components/Fronts/Comment";

export default {
  data() {
    return {
      ticket: null,
      resultUpdated: "",
      users: null,
    };
  },
  components: {
    CommentComp,
  },
  async created() {
    // get ticket
    // check permission first
    try {
      let ticketId = this.$route.params.ticketId;
      this.ticket = (await TicketsService.show(ticketId)).data;
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    },
  },
  computed: {
    ...mapState(["isUserLoggedIn", "user"]),
  },
};
</script>
<style scoped>
.hero {
  margin-top: 80px;
  max-width: 1150px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 5px;
  background: lightslategray;
  height: 250px;
  color: white;
  padding: 20px;
}
.hero h1 {
  margin-top: 30px;
}
.logo {
  padding-right: 20px;
}
.hero {
  margin-top: 80px;
  border-radius: 5px;
  background: lightslategray;
  height: 250px;
  color: white;
  padding: 20px;
}
.hero h1 {
  margin-top: 30px;
}
.logo {
  padding-right: 20px;
  max-width: 200px;
}
.ticket-wrapper {
  margin-top: 20px;
  padding: 40px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
}
.back-nav {
  margin-top: 20px;
  text-align: center;
}
.ticket-wrapper h1 {
  text-align: center;
  font-family: "kanit";
  padding-bottom: 50px;
}
.ticket-wrapper p {
  font-family: "kanit";
  font-size: 1.4em;
  padding-bottom: 20px;
}
.ticket-wrapper .content {
  font-family: "kanit";
  font-size: 1.2em;
}

</style>