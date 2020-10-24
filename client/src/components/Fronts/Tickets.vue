<template>
  <div>
    <main-header navsel="front"></main-header>
    <div class="hero-wrapper">
      <div class="component-wrapper">
        <div class="hero">
          <img src="@/assets/logo.png" class="logo" style="float:left" />
          <h1>ซื้อตั๋วได้เลยครับ</h1>
          <p>By Gooddev.ME</p>
        </div>
        <div class="container new-ticket">
          <h2>ตั๋ววันนี้</h2>
          <div class="row">
            <div class="col-md-3" v-for="ticket in newtickets" v-bind:key="ticket.id">
              <div v-if="ticket.thumbnail != 'null'">
                <img class="img-responsive" :src="BASE_URL+ticket.thumbnail" alt="thumbnail" />
              </div>
              <h4>{{ ticket.title }}</h4>
              <div v-html="ticket.content.slice(0,60) + '...'"></div>
              <p>
                <strong>ราคา:</strong>
                {{ ticket.prices | getNumberWithCommas
                }}
              </p>
              
              <div>
                <button v-on:click.prevent="addCart(ticket)" class="btn btnsm btn-danger">
                  <i class="fas fa-shopping-cart"></i> เพิ่มลงตระกร้า
                </button>
                <button class="btn btn-sm btn-info" v-on:click="navigateTo('/front-view-ticket/'+ ticket.id)">
                  <i class="fab fareadme"></i> อ่านเพิ่ม
                </button>
                
              </div>
            </div>
          </div>
        </div>
        <div class="clearfix"></div>
        <div class="ticket-header">
          <div>
            <form class="form-inline form-search">
              <span>
                <strong>จํานวน ticket:</strong>
                {{results.length}}
              </span>
              &nbsp;
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
             <div class="popup-cart" v-if="carts.length">
            <h3>ตระกร้าสินค้า</h3>
            <ul class="cart">
              <li v-for="cart in carts" v-bind:key="cart.id">
                <div>{{ cart.tickettitle }} จํานวน {{ cart.qty}} x {{ cart.prices }}</div>
                <div>
                  <button v-on:click.prevent="inc(cart)">+</button>
                  <button v-on:click.prevent="dec(cart)">-</button>
                </div>
              </li>
            </ul>
            <hr />
            <p>รวมทั้งสิน: {{total | getNumberWithCommas}} บาท</p>
            <button class="btn btn-xs btn-danger" v-on:click.prevent="sendBuy">
              <i class="fas fa-check-square"></i> ทำการสั่งซื้อ
            </button>
          </div>
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
              <!-- <p>status: {{ ticket.status }}</p> -->
              <p>
                <strong>ราคา:</strong>
                {{ book.prices | getNumberWithCommas
                }}
                
              </p>
              <p>
                <button v-on:click.prevent="addCart(ticket)" class="btn btnsm btn-danger">
                  <i class="fas fa-shopping-cart"></i> เพิ่มลงตระกร้า
                </button>
                <button
                  class="btn btn-sm btn-info"
                  v-on:click="navigateTo('/front-view-ticket/'+ ticket.id)">
                  <i class="fab fareadme"></i> อ่านเพิ่ม
                </button>
              </p>
            </div>
            <div class="clearfix"></div>
          </div>
          
        </transition-group>
        <div v-if="tickets.length === 0 && loading === false" class="empty-ticket">*** ไม่มีข้อมูล***</div>
        <div id="ticket-list-bottom">
          <div class="ticket-load-finished" v-if="tickets.length === results.length && results.length > 0">โหลดข้อมูลครบแล้ว</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TicketsService from "@/services/TicketsService";
import BuysService from "@/services/BuysService";
import _ from "lodash";
import ScrollMonitor from "scrollMonitor";
import { mapState } from "vuex";

let LOAD_NUM = 3;
let pageWatcher;

export default {
  watch: {
    search: _.debounce(async function (value) {
      const route = {
        name: "front-tickets",
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
        this.results = (await TicketsService.frontIndex(value)).data;
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
        // console.log(this.category)
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
      newTickets: [],
      carts: [],
      total: 0
    };
  },
  // async created () {
  // this.tickets = (await TicketsService.index()).data
  // },
  async created() {
    let allTickets = (await TicketsService.frontIndex()).data;
    this.newTickets = allTickets.slice(0, 4);
  },
  methods: {
    sendBuy() {
      this.carts.forEach(async (cart) => {
        console.log("cart: " + JSON.stringify(cart));
        try {
          await BuysService.post(cart);
          this.$router.push({
            name: "cartlist",
          });
        } catch (err) {
          console.log(err);
        }
      });
    },
    inc(item) {
      item.qty++;
      this.total += parseInt(item.prices);
    },
    dec(item) {
      item.qty--;
      this.total -= parseInt(item.prices);
      if (item.qty <= 0) {
        let i = this.carts.indexOf(item);
        this.carts.splice(i, 1);
        // this.total = 0
      }
    },
    appendResults: function () {
      if (this.tickets.length < this.results.length) {
        let toAppend = this.results.slice(
          this.tickets.length,
          LOAD_NUM + this.tickets.length
        );
        this.tickets = this.tickets.concat(toAppend);
      }
    },
    navigateTo(route) {
      if (this.user == null) {
        alert("Please, Register or Login before.\n\nThank you.");
      } else {
        this.$router.push(route);
      }
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
    addCart(ticket) {
      if (this.user == null) {
        alert("Please, Register or Login before.\n\nThank you.");
      } else {
        this.total += parseInt(ticket.prices);

        let found = false;
        this.carts.map((cart) => {
          if (cart.ticketid == ticket.id) {
            cart.qty++;
            found = true;
          }
        })

        if (!found) {
          let cart = {
            ticketid: ticket.id,
            userid: this.user.id,
            email: this.user.email ,
            qty: 1,
            clientStatus: "รอชำระ",
            shopStatus: "รอส่ง",
            tickettitle: ticket.title,
            username: this.user.name,
            userlastname: this.user.lastname,
            prices: ticket.prices,
          };
          this.carts.push(cart);
        }

        // console.log('carts length: ' + this.carts.length)
      }
    },
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
  /*mounted() {
    if (!this.isUserLoggedIn) {
      this.$router.push({
        name: "front-tickets",
      });
    }
  },*/
  computed: {
    ...mapState(["isUserLoggedIn", "user"]),
  },
  filters: {
    getNumberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
};
</script>
<style scoped>
.popup-cart {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  border: solid 1px #ddd;
  background: #fff;
  width: 360px;
  padding: 10px;
  position: fixed;
  bottom: 0;
  right: 0;
  border-radius: 5px;
  margin-bottom: 5px;
  margin-right: 5px;
}
.component-wrapper {
  padding-left: 5px;
  padding-right: 5px;
}
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
.empty-ticket {
  width: 100%;
  text-align: center;
  padding: 10px;
  background: darksalmon;
  color: white;
}
/* thumbnail */
.thumbnail-pic img {
  width: 200px;
  padding: 5px 5px 5px 5px;
  border: solid 1px #ccc;
  margin: 10px 10px 0px 0px;
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
  margin-top: 80px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}
#ticket-list-bottom {
  padding-top: 4px;
}
.ticket-load-finished {
  padding: 4px;
  text-align: center;
  background: seagreen;
  color: white;
}
.categories {
  margin-top: 20px;
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
.categories li.clear a {
  background: tomato;
  color: white;
}
.create-book {
  margin-top: 10px;
}
@media (max-width: 768px) {
  .logo {
    width: 120px;
  }
}
.new-ticket h2 {
  font-family: kanit;
  padding-bottom: 20px;
  margin-top: 30px;
}
.empty-ticket {
  width: 100%;
  text-align: center;
  padding: 4px;
  background: coral;
  color: white;
  margin-left: auto;
  margin-right: auto;
}
</style>
