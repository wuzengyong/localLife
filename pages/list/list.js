import fetch from '../../utils/fetch.js'
import regeneratorRuntime from '../../utils/runtime.js'
Page({


 
  data: {
    id: '', // 当前页面参数中的id值
    current: 1, // 表示当前页
    pageSize: 10, // 表示每页的条数
    shopList: [], // 商品列表
    hasMore: false // 是否还有更多的数据
  },
  // 页面加载的时候，获取到的id值
  onLoad(query) {
    this.data.id = query.id
    this.setData(this.data)
  },
  onShow() {
    this.getShopList()  
  },
  async onReady() {
    // 发送ajax请求，获取到当前页标题
    let res = await fetch(`categories/${this.data.id}`)
    // 动态的设置当前页标题
    wx.setNavigationBarTitle({
      title: res.data.name
    })
  },
  // 页面触底的回调函数
  onReachBottom () {
    if (!this.data.hasMore) return
    this.data.current++
    this.setData(this.data)
    this.getShopList()
  },
  async getShopList() {
    let {id, current, pageSize, shopList} = this.data
    let res = await fetch(`categories/${id}/shops?_page=${current}&_limit=${pageSize}`)
    this.data.shopList = [...shopList, ...res.data]

    // 判断是否还有更多的数据
    let total = res.header['X-Total-Count']
    this.data.hasMore = this.data.current < Math.ceil(total/this.data.pageSize) 
    this.setData(this.data)
  },
  onPullDownRefresh() {
    this.data.current = 1
    this.data.shopList = []
    this.setData(this.data)
    this.getShopList()
  }
})
