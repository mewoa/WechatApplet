// pages/info/info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database();
    db.collection('notice').orderBy('time', 'desc').get().then(res => {
      this.setData({
        notice: res.data
      })
      console.log('[数据库][查询] 成功：', res)
    })
      .catch(err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败',
        })
        console.error('[数据库][查询] 失败', err)
      })
  },

detail:function(e){
console.log(e)
  wx.navigateTo({
    url: '../info_dt/info_dt?title=' + e.currentTarget.dataset.title + '&content=' + e.currentTarget.dataset.content + '&teacher=' + e.currentTarget.dataset.teacher + '&time=' + e.currentTarget.dataset.time
  })
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
    
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onLoad()
    setTimeout(() => {
    wx.stopPullDownRefresh()
    }, 1500)

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})