// pages/modifyInfo/modifyInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textareaAValue: "",

  },


  submit: function (e) {
    const that = this;
    that.setData({
      infoContent: e.detail.value.txt
    })
    console.log(this.data.info)

    //更新记录即可。
    wx.cloud.callFunction({
      name: 'updateInfo',
      data: {
        docid: that.data.docid,
        infoContent:that.data.infoContent
      },
      success: function (res) {
        console.log(res)
      }, fail: function (res) {
        console.log(res)
      }
    })

    wx.showToast({
      title: '恭喜修改成功,请稍后刷新..',
      icon: "none",
      duration: 2000,
      mask: true
    })

    setTimeout(function () {
      wx.navigateBack({
        delta: 1
      })
      //要延时执行的代码
    }, 2000)
  },








  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      docid: options.docid,
      infoContent: options.infoContent
    })

  },
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
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