<template>
  <div class="container">
    <main-header navsel="back"></main-header>
    <div class="blog-header">
      <br />
      <br />
      <br />
      <h2>สมัครสมาชิก</h2>
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

      <div class="create-blog">
        <button
          class="btn btn-success btn-sm"
          v-on:click="navigateTo('/user/create')"
        >สร้างผู้ใช้</button>
        <strong>จํานวนผู้ใช้ {{users.length}}</strong>
      </div>
      <br />
    </div>
    <transition-group name="fade">
      <div v-for="user in users" v-bind:key="user.id" class="blog-list">
        <div class="blog-info">
          <p>id: {{ user.id }}</p>
          <p>ชื่อ-นามสกุล: {{ user.name }} - {{ user.lastname }}</p>
          <p>email: {{ user.email }}</p>
          <p>password: {{ user.password }}</p>
          <p>status: {{ user.status }}</p>
          <p>type: {{ user.type }}</p>

          <p>
            <button
              class="btn btn-sm btn-info"
              v-on:click="navigateTo('/user/'+ user.id)"
            >ดูข้อมูลผู้ใช้</button>
            <button
              class="btn btn-sm btn-warning"
              v-on:click="navigateTo('/user/edit/'+ user.id)"
            >แก้ไขข้อมูล</button>
            <button class="btn btn-sm btn-danger" v-on:click="deleteUser(user)">ลบข้อมูล</button>
          </p>
          <p>
            <a class="btn btn-danger btn-sm" href="#" v-on:click.prevent="pauseUser(user.id)">
              <i class="fas fa-pause"></i>Pause
            </a>&nbsp;
            <a
              class="btn btn-success btn-sm"
              href="#"
              v-on:click.prevent="activeUser(user.id)"
            >
              <i class="fas fa-check"></i>Active
            </a>&nbsp;
          </p>
        </div>
        <div class="clearfix"></div>
      </div>
    </transition-group>
    <div id="blog-list-bottom">
      <div class="empty-blog" v-if="users.length === 0 && loading === false">*** ไม่มีข้อมูล***</div>
      <div class="empty-blog" v-if="users.length === 0 && loading === true">*** ไม่มีข้อมูล***</div>
      <div class="blog-load-finished" v-if="users.length === results.length && results.length > 0" >โหลดข้อมูลครบแล้ว</div>
    </div>
  </div>
</template>
<script>
import UsersService from "@/services/UsersService";
import _ from "lodash";
export default {
  watch: {
    search: _.debounce(async function (value) {
      const route = {
        name: "users",
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
        this.loading = true;
        this.users = (await UsersService.index(value)).data;
        this.results = this.users
      },
    },
  },
  data() {
    return {
      users: [],
      search: "",
      results: [],
      loading: false
    };
  },
  async created() {
    try {
      this.users = (await UsersService.index()).data;
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    },
    async deleteUser(user) {
      await UsersService.delete(user);
      this.refreshData();
    },
    async refreshData() {
      this.users = (await UsersService.index()).data;
    },
    async pauseUser(userId) {
      let user = {
        id: userId,
        status: "pause",
      };
      try {
        await UsersService.put(user);
        this.refreshData();
      } catch (error) {
        console.log(error);
      }
    },
    async activeUser(userId) {
      let user = {
        id: userId,
        status: "active",
      };
      try {
        await UsersService.put(user);
        this.refreshData();
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
<style scoped>
.empty-blog {

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
.blog-info {
  float: left;
}
.blog-pic {
  float: left;
}
.clearfix {
  clear: both;
}
.blog-list {
  border: solid 1px #dfdfdf;
  margin-bottom: 10px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  padding: 5px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
.blog-header {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

#blog-list-bottom {
  padding-top: 4px;
}

#blog-list-bottom {
  padding: 10px;
  text-align: center;
  /*background: seagreen;*/
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
.create-blog {
  margin-top: 10px;
}
.categories li.clear a {
  background: tomato;
  color: white;
}
.blog-load-finished {
  padding: 4px;
  text-align: center;
  background: seagreen;
  color: white;
}
</style>