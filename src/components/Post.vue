<template>
  <div class="q-pa-md row items-start q-gutter-md cards-wrapper">
    <q-card class="my-card card" @click="detailsPage">
      <div class="date-block">
        <strong>{{ date[1] }}</strong>
        <br />
        {{ date[0] }}
      </div>
      <img
        class="card__image"
        :src="
          !post.image
            ? 'https://cdn.quasar.dev/img/mountains.jpg'
            : `${baseUrl + post.image}`
        "
      />
      <q-card-section>
        <p class="title">
          {{ post ? post.title : '' }}
        </p>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <p class="description">
          {{ post.description ? post.description : '' }}
        </p>
      </q-card-section>
      <q-card-section class="footer">
        <q-btn
          flat
          round
          color="black"
          icon="favorite_border"
          readonly
          :label="post.likes.length"
          class="q-pr-md"
        />
        <div class="text-subtitle2 avatar-wrapper">
          <img
            v-if="author && author.avatar"
            class="avatar"
            :src="`${baseUrl + authorAvatar()}`"
          />
          <q-icon v-else class="avatar" name="face" size="25px"></q-icon>
          <span>{{ author ? author.name : 'John Doe' }}</span>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import convertDate from '@/helpers/methods/convertDate.js';

export default {
  name: 'PostBlock',
  props: {
    post: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      author: null,
      baseUrl: process.env.VUE_APP_API,
    };
  },

  async mounted() {
    let authorId = this.post.postedBy;

    if (authorId) {
      this.author = await this.$store.dispatch('fetchAuthor', authorId);
    }
  },
  methods: {
    convertDate,

    detailsPage() {
      this.$router.push({ name: 'HomeView' });
    },
    authorAvatar() {
      if (this.author && this.author.avatar) return this.author.avatar;
    },
  },
  computed: {
    date() {
      return this.post.dateCreated
        ? this.convertDate(this.post.dateCreated).split(' ')
        : '';
    },
  },
};
</script>
<style lang="stylus" scoped>
@media screen and (min-width: 600px)
  .cards-wrapper
    width 80%
    margin 0 auto

.card
  text-align center
  max-width 100%
  &:hover
    cursor pointer
.date-block
  position absolute
  top -20px
  left 20px
  border 2px solid white
  padding 25px 25px
  font-size 20px
  text-align center
  color white
  background-color #433b3b
  @media screen and (max-width: 600px) {
    padding 15px 20px
    font-size 16px
  }
.avatar
  width 40px
  padding-right 5px
.avatar-wrapper
  display flex
  align-items center
.footer
  display flex
  align-items center
  border-top 2px dashed #0000003b
  justify-content space-between
  padding-top 5px
.description
  display -webkit-box !important
  -webkit-line-clamp 2
  -webkit-box-orient vertical
  white-space normal
  text-overflow ellipsis
  overflow hidden
  width 100%
  font-size 18px
  -webkit-line-clamp 4
  color #444b4d
.title
  @extends .description
  -webkit-line-clamp 2
  font-size 24px
  letter-spacing 2px
  color #1C1D1F
</style>
