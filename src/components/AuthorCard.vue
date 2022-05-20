<template>
  <div v-if="!isEditing" class="column flex-center no-wrap q-pt-xl author">
    <div class="author__header row q-pb-xl flex-center">
      <q-avatar size="100px">
        <img
          :src="
            !author || !author.avatar
              ? 'https://cdn.quasar.dev/img/boy-avatar.png'
              : baseUrl + author.avatar
          "
        />
      </q-avatar>
      <h4 class="q-pl-sm text-center">
        {{ author.name }}
      </h4>
    </div>
    <div class="author__main">
      <q-list class="author__main__list" bordered>
        <q-btn
          v-if="getUserState && getUserState._id === author._id"
          @click="isEditing = !isEditing"
          icon="settings"
          size="24px"
          class="cursor-pointer author__main__settings"
        />

        <q-item v-if="author.profession">
          <q-item-section avatar>
            <q-icon color="primary" name="badge" />
            <q-tooltip>Profession</q-tooltip>
          </q-item-section>

          <q-item-section>{{ author.profession }}</q-item-section>
        </q-item>

        <q-item v-if="author.skills">
          <q-item-section avatar>
            <q-icon color="primary" name="school" />
            <q-tooltip>Skills</q-tooltip>
          </q-item-section>

          <q-item-section>{{ author.skills }}</q-item-section>
        </q-item>

        <q-item v-if="author.details">
          <q-item-section avatar>
            <q-icon color="primary" name="density_medium" />
            <q-tooltip>Details</q-tooltip>
          </q-item-section>

          <q-item-section>{{ author.details }}</q-item-section>
        </q-item>

        <q-item v-if="author.extra_details">
          <q-item-section avatar>
            <q-icon color="primary" name="add" />
            <q-tooltip>Extra details</q-tooltip>
          </q-item-section>

          <q-item-section>{{ author.extra_details }}</q-item-section>
        </q-item>

        <q-item>
          <q-item-section avatar>
            <q-icon color="primary" name="access_time" />
          </q-item-section>

          <q-item-section
            >Account created:
            {{ timePassed(author.dateCreated) }}</q-item-section
          >
        </q-item>
      </q-list>
    </div>
    <q-btn
      v-if="getUserState && author._id === getUserState._id"
      color="primary"
      @click="newPost"
      >Create new Post</q-btn
    >
  </div>
  <div v-else class="column flex-center no-wrap q-pt-xl author">
    <div class="column q-pb-md">
      <div>
        <q-avatar class="cursor-pointer" size="100px">
          <img id="author__avatar" :src="imgFile" />
          <q-file
            class="z-max author__uploader"
            accept=".jpg, .png, image/*"
            rounded
            filled
            v-model="imgFile"
            @update:model-value="handleUpload"
          />
        </q-avatar>
      </div>
    </div>
    <div class="author__info full-width relative-position">
      <q-list class="profileList" bordered>
        <q-btn
          class="cursor-pointer author__main__settings"
          @click="isEditing = !isEditing"
          icon="settings"
          size="24px"
        />
        <q-item clickable>
          <q-item-section avatar>
            <q-icon color="primary" name="account_circle" />
            <q-tooltip>Name</q-tooltip>
          </q-item-section>

          <q-item-section><q-input autogrow v-model="name" /></q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar>
            <q-icon color="primary" name="badge" />
            <q-tooltip>Profession</q-tooltip>
          </q-item-section>

          <q-item-section
            ><q-input autogrow v-model="profession"
          /></q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar>
            <q-icon color="primary" name="school" />
            <q-tooltip>Skills</q-tooltip>
          </q-item-section>

          <q-item-section><q-input autogrow v-model="skills" /></q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar>
            <q-icon color="primary" name="density_medium" />
            <q-tooltip>Details</q-tooltip>
          </q-item-section>

          <q-item-section
            ><q-input autogrow v-model="details"
          /></q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar>
            <q-icon color="primary" name="add" />
            <q-tooltip>Extra details</q-tooltip>
          </q-item-section>

          <q-item-section
            ><q-input autogrow v-model="extra_details"
          /></q-item-section>
        </q-item>
      </q-list>
      <div class="text-center">
        <q-btn @click="saveChanges" color="primary" class="q-mr-sm q-pt-sm"
          >Save Changes</q-btn
        >
        <q-btn @click="cancelChanges" color="indigo-4">Cancel Editing</q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { timePassed } from '../helpers/convertDate';

export default {
  name: 'AuthorCard',
  props: {
    author: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      name: this.author.name,
      profession: this.author.profession,
      skills: this.author.skills,
      details: this.author.details,
      extra_details: this.author.extra_details,
      baseUrl: process.env.VUE_APP_API,
      isEditing: false,
      image: null,
      imgFile: null,
      sendImgFile: null,
      oldAvatar: null,
    };
  },

  mounted() {
    this.imgFile = this.baseUrl + this.author.avatar;
    this.oldAvatar = this.imgFile;
  },

  methods: {
    timePassed,

    handleUpload() {
      this.sendImgFile = this.imgFile;
      this.imgFile = URL.createObjectURL(this.imgFile);
    },

    async saveChanges() {
      if (this.sendImgFile) {
        const formData = new FormData();

        formData.append('avatar', this.sendImgFile);

        const imagePayload = { id: this.getUserState._id, img: formData };

        await this.$store.dispatch('updateAvatar', imagePayload);
        this.sendImgFile = null;
      }

      const profileFieldsArray = [
        'name',
        'profession',
        'skills',
        'details',
        'extra_details',
      ];
      const arrayOfChangedFields = profileFieldsArray.filter(
        (el) => this[el] !== this.author[el]
      );

      const changedData = {};

      for (let key of arrayOfChangedFields) {
        changedData[key] = this[key];
      }
      if (Object.keys(changedData).length) {
        this.$store.dispatch('updateUser', changedData);
      }
    },

    cancelChanges() {
      this.name = this.author.name;
      this.profession = this.author.profession;
      this.skills = this.author.skills;
      this.details = this.author.details;
      this.extra_details = this.author.extra_details;
      this.imgFile = this.oldAvatar;
    },

    newPost() {
      this.$router.push({ name: 'NewPost' });
    },
  },

  computed: {
    ...mapGetters(['getUserState']),
  },
};
</script>

<style lang="stylus" scoped>
.author
  &__main
    max-width 100%
    word-break break-all
    &__list
      position relative
      border none
    &__settings
      transition-duration 1s
      transform scale(.7)
      position absolute
      right -8px
      top -50px
      &:hover
        transform rotate(90deg) scale(.9)
  &__header
    word-break break-word
  &__uploader
    position absolute
    top 0
    left 0
    width 100px
    height 100px
    border-radius 50%
    font-size 80px
    opacity 0
</style>
