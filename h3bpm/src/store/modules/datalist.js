// import {getItemList} from '@/api/dataList'
import { data } from '@/commom/localdata/index'
const dataList = {
  state: {
    todoCounts: 0,
    toReadCounts: 0,
    // 选人列表
    dataList: [
      {
        name: '李四',
        position: '后端',
        id: 0,
        checked: false
      },
      {
        name: '关羽',
        position: 'UI',
        id: 1,
        checked: false
      },
      {
        name: '张飞',
        position: '产品经理',
        id: 2,
        checked: false
      },
      {
        name: '刘备',
        position: '开发',
        id: 3,
        checked: false
      }
    ],
    checkedPersonList: [],
    // 数据列表
    itemList: [],
    itemCheckList: [],
    visitedViews: []
  },

  mutations: {
    // 初始列表数据
    SET_DATA_LIST: (state, payload) => {
      console.log(payload, '初始列表数据')
      state.itemList = payload
    },
    // 改变待阅全选状态
    CHANGE_DATA_LIST_CHECKED: (state, payload) => {
      payload.map((item, index) => {
        item.isChecked = true
      })
      state.itemList = payload
    },
    // 取消待阅全选状态
    CHANGE_DATA_LIST_UNCHEKED: (state, payload) => {
      payload.map((item, index) => {
        item.isChecked = false
        item.checked = false
      })
      state.itemCheckList = []
      // state.itemList = payload
    },
    // 取消选中待阅单选状态
    SET_CHECKED_LIST: (state, payload) => {
      console.log(payload, '取消选中待阅单选状态')
      let check = state.itemList[payload.index].checked
      const status = !check
      state.itemList[payload.index].checked = status
      if (payload.item.checked) {
        state.itemCheckList.push(payload.item)
      } else {
        state.itemCheckList.splice(state.itemCheckList.indexOf(payload.item), 1)
      }
    },
    // 全选待阅
    SET_ALL_CHECKED_TOREAD: (state, payload) => {
      console.log(payload, 'SET_ALL_CHECKED_TOREAD')
      if (!payload.state) {
        state.itemCheckList = []
        payload.data.map((item) => {
          item.checked = true
          state.itemCheckList.push(item)
        })
        // state.itemCheckList = payload.data  直接塞进去 会 和另一个state联动所以要单个push
      } else {
        payload.data.map((item) => {
          item.checked = false
        })
        state.itemCheckList = []
      }
      // state.itemList = payload.data
    },
    // 待办数
    SET_TODO_COUNTS: (state, payload) => {
      state.todoCounts = payload
    },
    // 待阅数
    SET_TO_READ_COUNTS: (state, payload) => {
      state.toReadCounts = payload
    },
    // 添加面包屑
    ADD_VISITED_VIEW: (state, view) => {
      console.log(view, 'view')
      state.visitedViews = []
      if (state.visitedViews.some(v => v.path === view.path)) return
      state.visitedViews.push(
        Object.assign({}, view, {
          title: view.meta.title || 'no-name'
        })
      )
    },
    // 选中/取消发起人
    SET_CHECKED_PERSONS: (state, payload) => {
      // console.log(payload, 'SET_CHECKED_PERSONS')
      let check = state.dataList[payload.index].checked
      const status = !check
      state.dataList[payload.index].checked = status
      if (payload.data.checked) {
        state.checkedPersonList.push(payload.data)
      } else {
        // state.checkedPersonList.splice(payload.index, 1)
        state.checkedPersonList.splice(state.checkedPersonList.indexOf(payload.data), 1)
      }
    },
    // 清空已选发起人
    SET_EMPTY_PERSONS: (state, payload) => {
      state.checkedPersonList = payload
    },
    // 删除本部门已选发起人
    SET_DELETE_PERSONS: (state, payload) => {
      state.dataList.map((item, index) => {
        // console.log(item, index)
        if (item.id === payload.data.id) {
          item.checked = false
        }
      })
      // state.checkedPersonList.splice(payload.index, 1)
      state.checkedPersonList.splice(state.checkedPersonList.indexOf(payload.data), 1)
    },
    // 全选已选发起人
    SET_ALL_CHECKED_PERSONS: (state, payload) => {
      if (!payload.state) {
        state.checkedPersonList = []
        payload.data.map((item) => {
          item.checked = true
          state.checkedPersonList.push(item)
        })
      } else {
        payload.data.forEach((item) => {
          item.checked = false
        })
        state.checkedPersonList = []
      }
      // state.dataList = payload.data
    }
  },

  actions: {
    getItemList({ commit }, payload) {
      // console.log(data)
      commit('SET_DATA_LIST', data)
      // return new Promise((resolve, reject) => {
      //   getItemList().then(response => {
      //     console.log(response)
      //     resolve(response)
      //   }).catch(error => {
      //     reject(error)
      //   })
      // })
    },
    // 待办数量
    setTodoCounts({ commit }, count) {
      commit('SET_TODO_COUNTS', count)
    },
    // 待阅数量
    setToReadCounts({ commit }, count) {
      commit('SET_TO_READ_COUNTS', count)
    },
    // 添加面包屑路由
    addView({ commit }, view) {
      commit('ADD_VISITED_VIEW', view)
    }
  }
}

export default dataList
