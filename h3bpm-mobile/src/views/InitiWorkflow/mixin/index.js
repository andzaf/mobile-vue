import BtScroll from '@/components/BtScroll/index'
import NoData from '@/components/NoData/index'
import {initSelfWorkflow, setFavoriteWorkflow} from '@/api/loadWorkFlows'
import { ERR_OK } from '@/api/options/statusCode'
import DingtalkEnv from 'dingtalk-javascript-env'
import dingtalk from 'dingtalk-javascript-sdk'
import {getBaseUrl} from '@/utils/auth'
import { Toast } from 'mint-ui'
const InitWorkflowMixin = {
  data() {
    return {
      probeType: 0,
      pullingUp: true,
      beforeScroll: true,
      listenScroll: true,
      activeClass: 'activeClass',
      activeClass2: 'activeClass2',
      activeClass3: 'activeClass3',
      showLoading: false,
      baseUrl: getBaseUrl()
    }
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
    this.pullingUp = true
  },
  methods: {
    getDataList() {
      this.showLoading = true
      this.$store.dispatch('getWorkFlowLst')
        .then((res) => {
          this.showLoading = false
        })
        .catch((req) => {
          this.showLoading = false
        })
    },
    // 搜索
    handleSearch() {
      // console.log(this.searchList)
      let articlesArray = this.searchList
      let searchString = this.inputValue

      if (!searchString) {
        return articlesArray
      }

      articlesArray = articlesArray.filter(function(item) {
        if (item.DisplayName.toLowerCase().indexOf(searchString) !== -1) {
          return item
        }
      })

      this.$store.dispatch('setWorkFlowLst', articlesArray)
      // console.log(articlesArray, 'articlesArray')
    },
    // 点击流程
    handleClickSelect(item, index) {
      this.showLoading = true
      this.initSelfWork(item)
    },
    // 设为常用
    setFavorite(item) {
      console.log(item)
      this.SetFavWork(item)
    },
    // 发起流程
    initSelfWork(data) {
      const options = {
        WorkflowCode: data.WorkflowCode,
        PageAction: 'Close',
        IsMobile: 'true'
      }
      return new Promise((resolve, reject) => {
        initSelfWorkflow(options).then(res => {
          this.showLoading = false
          if (res.code === ERR_OK) {
            const urls = this.baseUrl + res.data.url
            // const urls = `http://` + this.baseUrl + res.data
            // console.log(res.data)
            // const urls = `http://192.168.7.48:8080` + res.data.Url
            // this.src = urls
            if (DingtalkEnv.isDingtalk) {
              dingtalk.ready(function() {
                const dd = dingtalk.apis
                dd.biz.util.openLink({
                  url: urls + `&loginfrom=dingtalk`,
                  onSuccess: function(result) {
                  },
                  onFail: function(err) {
                    console.log(err)
                  }
                })
              })
            } else {
              window.location.href = urls
            }
          }
          resolve(res)
        }).catch(error => {
          reject(error)
          this.loadingShow = false
        })
      })
    },
    // 设为常用
    SetFavWork(data) {
      const options = {
        workflowCode: data.WorkflowCode,
        isFavorite: !data.IsFavorite
      }
      return new Promise((resolve, reject) => {
        setFavoriteWorkflow(options).then(res => {
          this.showLoading = false
          if (res.code === ERR_OK) {
            let instance = Toast({
              message: this.$t('home.success'),
              iconClass: 'icon el-icon-success'
            })
            setTimeout(() => {
              instance.close()
              this.getDataList()
            }, 1000)
          } else {
            let instance = Toast({
              message: this.$t('home.fail'),
              iconClass: 'icon el-icon-error'
            })
            setTimeout(() => {
              instance.close()
              this.getDataList()
            }, 1000)
          }
          resolve(res)
        }).catch(error => {
          reject(error)
          this.loadingShow = false
        })
      })
    },
    // 下拉
    scroll(pos) {
      // console.log(pos.y)
    },

    //  刷新
    refresh() {
      this.$refs.userList.refresh()
    },

    //  下拉监听
    listScroll() {
      this.$emit('listScroll')
    }
  },
  watch: {
    inputValue(value) {
      if (!value) {
        this.$store.commit('SER_SEARCH_LIST', this.searchList)
      }
    }
  },
  computed: {
    workFlowLst() {
      return this.$store.getters.workFlowLst
    }
  },
  components: {
    BtScroll,
    NoData
  }
}
export default InitWorkflowMixin
