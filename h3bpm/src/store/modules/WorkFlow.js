import {getWorkFlowLst} from '@/api/loadWorkFlows'
import {ERR_OK} from '@/api/options/statusCode'
const WorkFlow = {
  state: {
    workFlowLst: [] // 数据列表
  },
  mutations: {
    SET_WORK_FLOW_LIST: (state, payload) => {
      state.workFlowLst = payload.Workflows
    }
  },
  actions: {
    getWorkFlowLst({ commit }, payload) {
      return new Promise((resolve, reject) => {
        getWorkFlowLst(payload).then(res => {
          if (res.code === ERR_OK) {
            console.log(res.data)
            commit('SET_WORK_FLOW_LIST', res.data)
          }
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
export default WorkFlow