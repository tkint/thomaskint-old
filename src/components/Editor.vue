<template>
  <div id="editor">
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs12>

        </v-flex>
      </v-layout>
      <v-divider></v-divider>
      <v-layout row wrap>
        <v-flex xs12>
          <medium-editor
            :text="page.content"
            :options="options"
            v-on:edit="editText"
            custom-tag='v-container'
          ></medium-editor>
        </v-flex>
      </v-layout>
    </v-container>
    <!--<v-container fluid>-->
    <!--<v-layout row wrap>-->
    <!--<v-flex xs1 v-for="(item, index) in $encoder.tags" :key="index">-->
    <!--<v-btn :flat="!(item.btn && item.btn.color)" round @click.native.stop="addTag(item)"-->
    <!--:class="(item.btn && item.btn.color && !item.btn.color.includes('#')) ? item.btn.color : ''"-->
    <!--:style="(item.btn && item.btn.color && item.btn.color.includes('#')) ? 'background: ' + item.btn.color : ''">-->
    <!--<v-icon-->
    <!--:fa="item.btn && item.btn.icon && item.btn.icon.fa"-->
    <!--:style="(item.btn && item.btn.size) ? 'font-size: ' + item.btn.size : ''"-->
    <!--v-if="item.btn && item.btn.icon && item.btn.icon.text"-->
    <!--&gt;-->
    <!--{{ item.btn.icon.text }}-->
    <!--</v-icon>-->
    <!--<span v-else-->
    <!--:style="(item.btn && item.btn.size) ? 'font-size: ' + item.btn.size : ''"-->
    <!--&gt;-->
    <!--{{ (item.btn && item.btn.text) ? item.btn.text : item.tag }}-->
    <!--</span>-->
    <!--</v-btn>-->
    <!--</v-flex>-->
    <!--</v-layout>-->
    <!--<v-divider></v-divider>-->
    <!--<v-layout row>-->
    <!--<v-flex xs12>-->
    <!--<v-text-field-->
    <!--id="page-content"-->
    <!--multiLine-->
    <!--autoGrow-->
    <!--rows="30"-->
    <!--v-model="page.content"-->
    <!--&gt;</v-text-field>-->
    <!--</v-flex>-->
    <!--</v-layout>-->
    <!--</v-container>-->
  </div>
</template>

<script>
  import MediumEditor from 'vue2-medium-editor';
  import AnimateExtension from '@/medium-editor/extensions/animate';
  import TitleExtension from '@/medium-editor/extensions/title';

  require('medium-editor/dist/css/medium-editor.min.css');
  require('medium-editor/dist/css/themes/default.min.css');

  export default {
    name: 'editor',
    components: { MediumEditor },
    props: ['page'],
    data() {
      return {
        oldPage: null,
        pageChanged: false,
        numorders: [],
        fa: null,
        createLink: false,
        text: null,
        options: {
          targetBlank: true,
          placeholder: false,
          toolbar: {
            static: true,
            buttons: [
              'bold',
              'italic',
              'underline',
              'h1',
              'h2',
              'h3',
              'h4',
              'h5',
              'h6',
              'quote',
              'animate',
              'title',
            ],
          },
          anchor: {
            linkValidation: true,
            targetCheckbox: true,
          },
          extensions: {
            animate: new AnimateExtension(),
            title: new TitleExtension(),
          },
        },
      };
    },
    methods: {
      editText(operation) {
        if (operation &&
          operation.event &&
          operation.event.srcElement &&
          operation.event.srcElement.innerHTML) {
          this.page.content = operation.event.srcElement.innerHTML;
        }
      },
      addTag(tag) {
        this.page.content = this.$encoder.addTag('page-content', tag);
      },
    },
  };
</script>

<style scoped>
</style>
