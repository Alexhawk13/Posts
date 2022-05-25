<template>
  <q-table
    v-if="!isLoading && myPosts.length"
    title="User's Posts"
    :rows="myPosts"
    :columns="columns"
    row-key="name"
    grid
    class="text-center posts-table q-pt-lg"
  >
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>

    <template v-slot:item="props">
      <q-card
        class="posts-table__card text-center q-py-sm q-px-lg q-ma-xs cursor-pointer"
        :props="props"
      >
        <q-btn
          v-if="getUserData && props.row.postedBy === getUserData._id"
          @click="deletePost(props.row._id)"
          class="posts-table__card__delete-btn"
          >x</q-btn
        >
        <q-tr
          @click="postDetails(props.row._id)"
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          class="posts-table__card__row"
        >
          <p class="posts-table__card__row__data" v-if="col.name != 'image'">
            {{ col.value }}
          </p>

          <img
            v-else
            class="posts-table__card__row__img"
            :src="
              props.row.image
                ? baseUrl + props.row.image
                : 'https://cdn.quasar.dev/img/mountains.jpg'
            "
          />
        </q-tr>
      </q-card>
    </template>
  </q-table>
  <p v-else class="text-center text-italic q-pt-lg">
    This user has no posts yet
  </p>
</template>

<script>
import { mapGetters } from 'vuex';
import { dialogDeleteWrapper } from '@/helpers/deleteConfirmation';

const columns = [
  {
    name: 'image',
    align: 'center',
    label: 'image',
    field: 'image',
  },
  {
    name: 'title',
    align: 'center',
    label: 'title',
    field: 'title',
  },
  {
    name: 'description',
    label: 'description',
    field: 'description',
  },
];

export default {
  data() {
    return {
      columns,
      isLoading: true,
      myPosts: null,
      baseUrl: process.env.VUE_APP_API,
    };
  },

  mounted() {
    this.fetchOwnPosts();
  },

  watch: {
    $route: {
      handler() {
        this.fetchOwnPosts();
      },
    },
  },

  methods: {
    dialogDeleteWrapper,

    postDetails(id) {
      this.$router.push({ name: 'PostDetailsView', params: { id } });
    },

    deletePost(id) {
      dialogDeleteWrapper('post', () => {
        this.$store.dispatch('deletePost', id);
        this.myPosts = this.myPosts.filter((post) => post._id !== id);
      });
    },

    async fetchOwnPosts() {
      if (this.$route.name === 'AuthorView') {
        try {
          this.isLoading = true;
          const authorId = this.$route.params.id;
          const payload = { id: authorId, limit: { params: { limit: 0 } } };

          const myPosts = await this.$store.dispatch('fetchOwnPosts', payload);

          this.myPosts = myPosts;
        } finally {
          this.isLoading = false;
        }
      }
    },
  },
  computed: {
    ...mapGetters(['getPosts', 'getUserData']),

    getMyPosts() {
      return this.myPosts;
    },
  },
};
</script>

<style lang="stylus">
.posts-table
  &__card
    width 300px
    text-align -webkit-center
    overflow hidden
    background-color #f2fbfb
    &__row
      display block
      &__img
        max-width 100%
        height 200px
      &__data
        overflow hidden
        text-overflow ellipsis
    &__delete-btn
      position absolute
      top 0
      right 0
      background-color #ac5959
      color #fff
  &.q-table--grid .q-table__grid-content
    justify-content center !important
  & .q-table__top .q-table__control
  & .q-table__bottom
    margin 0 auto
</style>
