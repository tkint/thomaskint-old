<template>
  <div id="page">
    <v-card>
      <v-card-text>
        <v-container fluid>
          <v-layout row>
            <v-flex xs12>
              <v-text-field
                label="Name"
                v-model="page.name"
                v-on:input="onPageNameChange"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12>
              <v-text-field
                label="Path"
                v-model="page.path"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 md3>
              <v-text-field
                label="Link"
                v-model="page.link"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 md3>
              <v-text-field
                label="Order"
                v-model="page.numorder"
              ></v-text-field>
              <span v-for="n in numorders" :class="n.numorder === page.numorder ? 'red--text' : ''">{{ n.numorder }} </span>
            </v-flex>
            <v-flex xs12 md3>
              <v-text-field
                label="Icon"
                v-model="page.icon"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 md3>
              <v-switch
                label="Font Awesome"
                v-model="fa"
              ></v-switch>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs1 v-for="(item, index) in buttonTags" :key="index">
              <v-btn icon @click.native.stop="addTag(item.tag)">
                <v-icon :fa="item.fa">{{ item.icon }}</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <div id="tag-name"></div>
          <v-layout row>
            <v-flex xs12>
              <v-text-field
                id="page-content"
                label="Content"
                multiLine
                autoGrow
                v-model="page.content"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12>
              <v-text-field
                label="Style"
                multiLine
                autoGrow
                v-model="page.style"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click.native="save">
          <span v-if="isEdit">Save</span>
          <span v-else>Create</span>
        </v-btn>
        <v-btn v-if="isEdit" @click.native="goBack">Back</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
  export default {
    name: 'pageform',
    data() {
      return {
        buttonTags: [
          { icon: 'format_align_center', tag: 'center', fa: false },
          { icon: 'format_align_justify', tag: 'justify', fa: false },
        ],
        numorders: [],
        page: {
          name: null,
          link: null,
          path: null,
          icon: null,
          fa: null,
          numorder: null,
          content: null,
          style: null,
        },
        fa: null,
        createLink: false,
        editBtn: null,
        saveBtn: {
          self: this,
          enabled: true,
          icon: 'save',
          color: 'teal',
          action() {
            return this.self.save();
          },
        },
        backBtn: {
          self: this,
          enabled: true,
          icon: 'reply',
          color: 'orange',
          action() {
            return this.self.goBack();
          },
        },
      };
    },
    created() {
      this.getPage();
      this.getNumorders();
      this.updateMenu();
    },
    destroyed() {
      this.resetMenu();
    },
    computed: {
      isEdit() {
        return this.$route.params.action === 'edit';
      },
    },
    methods: {
      updateMenu() {
        this.editBtn = this.$parent.adminBtns[0];
        this.$parent.adminBtns.splice(0, 1, this.saveBtn);
        this.$parent.adminBtns.splice(1, 0, this.backBtn);
      },
      resetMenu() {
        this.$parent.adminBtns.splice(0, 2, this.editBtn);
      },
      getPage() {
        if (this.$route.params.action === 'edit' && this.$route.params.page) {
          this.axios.get(`page/${this.$route.params.page}`).then((response) => {
            this.page = response.data;
          });
        }
      },
      getNumorders() {
        this.axios.get('page/numorders').then((response) => {
          this.numorders = response.data;
          if (!this.page.numorder) {
            this.page.numorder = parseInt(this.numorders[this.numorders.length - 1].numorder, 10) + 1;
          }
        });
      },
      onPageNameChange() {
        this.page.name = this.page.name.replace(/\s/g, '').trim();
        this.page.path = `/${this.page.name.toLowerCase()}`;
        this.page.link = this.page.name;
        this.page.link = this.link.name.replace(/([A-Z])/g, ' $1').trim();
      },
      goBack() {
        if (this.isEdit) {
          this.$router.push({ name: this.page.name });
        } else {
          this.$router.push({ path: '/' });
        }
      },
      save() {
        if (this.isValid()) {
          this.page.fa = this.fa;
          if (this.$route.name === 'NewPage') {
            this.axios.post('page', this.page).then((response) => {
              this.page = response.data;
              this.goBack();
            });
          } else {
            this.axios.put('page', this.page).then((response) => {
              this.page = response.data;
              this.goBack();
            });
          }
        }
      },
      isValid() {
        return true;
      },
      addTag(tag) {
        const input = document.getElementById('page-content');
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const sel = input.value.substring(start, end);
        const finText = `${input.value.substring(0, start)}<${tag}>${sel}</${tag}>${input.value.substring(end)}`;
        this.page.content = finText;
        input.focus();
        input.setSelectionRange(start, end);
      },
      addTagOld(tag) {
        let value = this.page.content;
        const input = document.getElementById('page-content');
        const pos = this.getCursorPos(input);
        if (pos !== -1 && pos.start !== 0) {
          const before = value.substring(0, pos.start);
          if (pos.end > pos.start) {
            const text = value.substring(pos.start, pos.end);
            if (value.length > pos.end) {
              const after = value.substring(pos.end, value.length);
              value = `${before}<${tag}>${text}</${tag}>${after}`;
            } else {
              value = `${before}<${tag}>${text}</${tag}>`;
            }
          } else if (pos.start < value.length) {
            const after = value.substring(pos.start, value.length);
            value = `${before}<${tag}></${tag}>${after}`;
          } else {
            value = `${before}<${tag}></${tag}>`;
          }
        } else if (value && pos.start === 0) {
          value = `<${tag}></${tag}>${value}`;
        } else if (value) {
          value += `<${tag}></${tag}>`;
        } else {
          value = `<${tag}></${tag}>`;
        }
        this.page.content = value;
        input.focus();
        input.selectionEnd = pos.end;
      },
      getCursorPos(input) {
        if (input.selectionStart || input.selectionStart === 0 || input.selectionStart === '0') {
          return {
            start: input.selectionStart,
            end: input.selectionEnd,
          };
        }
        return -1;
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #hello {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    vertical-align: middle;
  }

  .img-responsive {
    max-width: 100%;
    height: auto;
  }
</style>
