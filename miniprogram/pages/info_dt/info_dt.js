// pages/info_dt/info_dt.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"",
    content:"",
    teacher:"",
    time:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    console.log(option)
    this.setData({
      title: option.title,
      content:option.content,
      time:option.time,
      teacher:option.teacher
    })
    console.log("获取到的teacher:", this.data.teacher)
    console.log("获取到的time:", this.data.time)
    console.log("获取到的title:", this.data.title)
    console.log("获取到的content:", this.data.content)

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