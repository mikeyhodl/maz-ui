<template>
  <div class="get-started">
    <div
      class="get-started__header maz-flex maz-space-between maz-align-center"
    >
      <h2>Get Started</h2>
      <MazBtn
        v-scroll-to="{
          el: '#allComponents',
          container: '.documentation__container',
        }"
        href="#allComponents"
      >
        List of all components
      </MazBtn>
    </div>

    <hr class="maz-border-top maz-border-solid maz-border-color maz-my-5" />

    <h3>Install maz-ui</h3>
    <CodeContainer
      language="bash"
      code="npm i maz-ui@2 -S

# or yarn add maz-ui"
      class="maz-my-4"
    />

    <hr class="maz-border-top maz-border-solid maz-border-color maz-mb-5" />
    <h3 class="maz-mb-2">On demand</h3>

    <h4>Import only the components you need</h4>

    <p>
      With the help of
      <a href="https://www.npmjs.com/package/babel-plugin-component"
        ><strong>babel-plugin-component</strong></a
      >, we can import components we actually need, making the project smaller
      than otherwise.
    </p>

    <p>First, install babel-plugin-component:</p>

    <CodeContainer
      language="bash"
      code="npm install babel-plugin-component -D

# or yarn add babel-plugin-component -D"
    />

    <h4>Babel config</h4>

    <CodeContainer
      code="// babel.config.js

module.exports = {
  plugins: [
    [
      'component',
      {
        libraryName: 'maz-ui',
        styleLibraryName: 'css'
      }
    ]
  ]
};"
    />
    <h4>Nuxt.JS babel config</h4>

    <CodeContainer
      :code="`// nuxt.config.js

module.exports = {
  plugins: [
    ...
    './plugins/maz-ui'
    ...
  ],
  build: {
    babel: {
      plugins: [
        [
          'component', {
            libraryName: 'maz-ui',
            styleLibraryName: 'css'
          }
        ]
      ]
    }
  }
}`"
    />

    <h4>Now import component as you want</h4>

    <CodeContainer
      code="/*
* main.js
* ./plugin/maz-ui/index.js for Nuxt.JS
*/

import Vue from 'vue'
import { MazBtn, MazInput } from 'maz-ui'

Vue.use(MazBtn)
Vue.use(MazInput)

/* or
 * Vue.component(MazBtn.name, MazBtn)
 * Vue.component(MazInput.name, MazInput)
 */"
    />
    <hr
      id="allComponents"
      class="maz-border-top maz-border-solid maz-border-color maz-my-5"
    />
    <h3 class="maz-mb-0">All components you can import</h3>
    <CodeContainer
      :code="`import Vue from 'vue'
import {
  MazAvatar,
  MazBottomSheet,
  MazBtn,
  MazBtnGroup,
  MazCard,
  MazCarousel,
  MazCheckbox,
  MazCollapse,
  MazDialog,
  MazDraggableList,
  MazDropdown
  MazDropzone,
  MazFlex,
  MazGallery,
  MazImg,
  MazInput,
  MazInputTags,
  MazList,
  MazListItem,
  MazLoader,
  MazPagination,
  MazPicker,
  MazPlotly,
  MazProgressBar,
  MazPhoneNumberInput,
  MazRadio,
  MazReadMore,
  MazResponsiveMenu,
  MazSearch,
  MazSelect,
  MazSlider,
  MazSidebar,
  MazSpinner,
  MazStepper,
  MazSwitch,
  MazTabsBar,
  MazTabsContent,
  MazTabsContentItem,
  MazTransitionExpand,
} from 'maz-ui'

Vue.use(MazAvatar)
Vue.use(MazBottomSheet)
Vue.use(MazBtn)
Vue.use(MazBtnGroup)
Vue.use(MazCard)
Vue.use(MazCarousel)
Vue.use(MazCheckbox)
Vue.use(MazCollapse)
Vue.use(MazDialog)
Vue.use(MazDraggableList)
Vue.use(MazDropdown)
Vue.use(MazDropzone)
Vue.use(MazFlex)
Vue.use(MazGallery)
Vue.use(MazImg)
Vue.use(MazInput)
Vue.use(MazInputTags)
Vue.use(MazList)
Vue.use(MazListItem)
Vue.use(MazLoader)
Vue.use(MazPagination)
Vue.use(MazPicker)
Vue.use(MazPlotly)
Vue.use(MazProgressBar)
Vue.use(MazPhoneNumberInput)
Vue.use(MazRadio)
Vue.use(MazReadMore)
Vue.use(MazResponsiveMenu)
Vue.use(MazSearch)
Vue.use(MazSelect)
Vue.use(MazSlider)
Vue.use(MazSidebar)
Vue.use(MazSpinner)
Vue.use(MazStepper)
Vue.use(MazSwitch)
Vue.use(MazTabsBar)
Vue.use(MazTabsContent)
Vue.use(MazTabsContentItem)
Vue.use(MazTransitionExpand)`"
    />
  </div>
</template>

<script>
export default {
  name: "GetStarted",
  layout: "documentation",
};
</script>

<style lang="scss" scoped>
.get-started {
  p {
    margin: 15px 0;
  }

  @media screen and (max-width: $breakpoint-laptop-s) {
    &__container {
      flex-direction: column;
    }

    &__item {
      padding: 0;
      border: none;
    }
  }
}
</style>
