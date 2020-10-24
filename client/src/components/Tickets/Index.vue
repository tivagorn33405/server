<template>
  <div class="container">
    <main-header navsel="back"></main-header>
    <div class="ticket-header">
      <br />
      <br />
      <h2>ส่วนจัดการ tickets</h2>
      <div>
        <form class="form-inline form-search">
          <div class="form-group">
            <div class="input-group">
              <input
                type="text"
                v-model="search"
                class="form-control"
                id="exampleInputAmount"
                placeholder="Search"
              />
              <div class="input-group-addon">
                <i class="fas fa-search"></i>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="create-ticket">
        <button class="btn btn-success btn-sm" v-on:click="navigateTo('/ticket/create')">Create ticket</button>
        <strong>จํานวน ticket:</strong>
        {{results.length}}
      </div>

      <ul class="categories">
        <li v-for="cate in category" v-bind:key="cate.index">
          <a v-on:click.prevent="setCategory(cate)" href="#">{{ cate }}</a>
        </li>
        <li class="clear">
          <a v-on:click.prevent="setCategory(' ')" href="#">Clear</a>
        </li>
      </ul>
      <div class="clearfix"></div>
    </div>
    <transition-group name="fade">
      <div v-for="ticket in tickets" v-bind:key="ticket.id" class="ticket-list">
        <!-- <p>id: {{ ticket.id }}</p> -->
        <div class="ticket-pic">
          <!-- <transition name="fade"> -->
          <div class="thumbnail-pic" v-if="ticket.thumbnail != 'null'">
            <img :src="BASE_URL+ticket.thumbnail" alt="thumbnail" />
          </div>
          <!-- </transition> -->
        </div>
        <h3>{{ ticket.title }}</h3>
        <div v-html="ticket.content.slice(0,200) + '...'"></div>
        <div class="ticket-info">
          <p>
            <strong>Category:</strong>
            {{ ticket.category }}
          </p>
          <p>
            <strong>Create:</strong>
            {{ ticket.createdAt }}
          </p>
          <p>
            <strong>status:</strong>
            {{ ticket.status }}
          </p>
          <p>
            <strong>Prices:</strong>
            {{ ticket.prices | getNumberWithCommas }} บาท
          </p>
          <!-- <p>status: {{ ticket.status }}</p> -->
          <p>
            <button class="btn btn-sm btn-info" v-on:click="navigateTo('/ticket/'+ ticket.id)">View Ticket</button>
            <button
              class="btn btn-sm btn-warning"
              v-on:click="navigateTo('/ticket/edit/'+ ticket.id)"
            >Edit ticket</button>
            <button class="btn btn-sm btn-danger" v-on:click="deleteTicket(ticket)">Delete</button>
          </p>
          <p>
            <a class="btn btn-danger btn-sm" href="#" v-on:click.prevent="suspend(ticket.id)">
              <i class="fas fa-pause"></i> Suspend
            </a>&nbsp;
            <a class="btn btn-success btn-sm" href="#" v-on:click.prevent="publish(ticket.id)">
              <i class="fas fa-check"></i> Published
            </a>&nbsp;
          </p>
        </div>
        <div class="clearfix"></div>
      </div>
    </transition-group>

    <div id="ticket-list-bottom">
      <div class="empty-ticket" v-if="tickets.length === 0 && loading === false">*** ไม่มีข้อมูล***</div>
      <div class="empty-ticket" v-if="tickets.length === 0 && loading === true">*** ไม่มีข้อมูล***</div>
      <div
        class="ticket-load-finished"
        v-if="tickets.length === results.length && results.length > 0"
      >โหลดข้อมูลครบแล้ว</div>
    </div>
  </div>
</template>
<script>
import TicketsService from "@/services/TicketsService";
import _ from "lodash";
import ScrollMonitor from "scrollMonitor";

let LOAD_NUM = 5;
let pageWatcher;

export default {
  watch: {
    search: _.debounce(async function (value) {
      const route = {
        name: "tickets",
      };

      if (this.search !== "") {
        route.query = {
          search: this.search,
        };
      }

      console.log("search: " + this.search);
      this.$router.push(route);
    }, 700),

    "$route.query.search": {
      immediate: true,
      async handler(value) {
        this.tickets = [];
        this.results = [];
        this.loading = true;
        this.results = (await TicketsService.index(value)).data;
        this.appendResults();

        this.results.forEach((ticket) => {
          if (this.category.length > 0) {
            // console.log(this.category.indexOf(ticket.category))
            if (this.category.indexOf(ticket.category) === -1) {
              this.category.push(ticket.category);
            }
          } else {
            this.category.push(ticket.category);
          }
        });
        this.loading = false;
        this.search = value;
        //console.log(this.category)
      },
    },
  },
  data() {
    return {
      tickets: [],
      BASE_URL: "http://localhost:8081/assets/uploads/",
      search: "",
      results: [],
      category: [],
      loading: false,
    };
  },
  async created() {
    this.tickets = (await TicketsService.index()).data;
  },
  methods: {
    wait(ms) {
      return (x) => {
        return new Promise((resolve) => setTimeout(() => resolve(x), ms));
      };
    },
    appendResults: function () {
      if (this.tickets.length < this.results.length) {
        let toAppend = this.results.slice(
          this.tickets.length,
          LOAD_NUM + this.tickets.length // จำกัดการแสดงผล
        );
        this.tickets = this.tickets.concat(toAppend);
      }
    },
    navigateTo(route) {
      this.$router.push(route);
    },
    async deleteTicket(ticket) {
      try {
        await TicketsService.delete(ticket);
        this.refreshData();
      } catch (err) {
        console.log(err);
      }
    },
    async refreshData() {
      this.tickets = (await TicketsService.index()).data;
    },
    setCategory(keyword) {
      if (keyword === " ") {
        this.search = "";
        console.log("null");
      } else {
        this.search = keyword;
      }
    },
    updated() {
      let sens = document.querySelector("#ticket-list-bottom");
      pageWatcher = ScrollMonitor.create(sens);
      pageWatcher.enterViewport(this.appendResults);
    },
    beforeUpdated() {
      if (pageWatcher) {
        pageWatcher.destroy();
        pageWatcher = null;
      }
    },
    async suspend(ticketId) {
      let user = {
        id: ticketId,
        status: " Suspend",
      };
      try {
        await TicketsService.put(user);
        this.refreshData();
      } catch (error) {
        console.log(error);
      }
    },
    async publish(ticketId) {
      let user = {
        id: ticketId,
        status: "published",
      };
      try {
        await TicketsService.put(user);
        this.refreshData();
      } catch (error) {
        console.log(error);
      }
    },
  },
  filters: {
    getNumberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
};
</script>
<style scoped>
.empty-ticket {
  width: 100%;
  text-align: center;
  padding: 4px;
  background: coral;
  color: white;
}
/* thumbnail */
.thumbnail-pic img {
  width: 200px;
  padding: 5px 10px 0px 0px;
}
.ticket-info {
  float: left;
}
.ticket-pic {
  float: left;
}
.clearfix {
  clear: both;
}
.ticket-list {
  border: solid 1px #dfdfdf;
  margin-bottom: 10px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  padding: 5px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
.ticket-header {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

#ticket-list-bottom {
  padding-top: 4px;
}

#ticket-list-bottom {
  padding: 4px;
  text-align: center;
  color: white;
}
.categories {
  margin-top: 10px;
  padding: 0;
  list-style: none;
  float: left;
}
.categories li {
  float: left;
  padding: 2px;
}
.categories li a {
  padding: 5px 10px 5px 10px;
  background: paleturquoise;
  color: black;
  text-decoration: none;
}
.create-ticket {
  margin-top: 10px;
}
.categories li.clear a {
  background: tomato;
  color: white;
}
.book-load-finished {
  padding: 4px;
  text-align: center;
  background: seagreen;
  color: white;
}
.emptybook {
  background-color: coral;
  border-color: coral;
}
</style>