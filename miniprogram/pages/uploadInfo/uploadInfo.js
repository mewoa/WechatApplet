// pages/uploadInfo/uploadInfo.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"",
    info:"",
    modalName: null,
    textareaAValue: '',
  },
  
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },


  submit: function (e) {
    const that = this;

    that.setData({
      title: e.detail.value.title,
      info: e.detail.value.txt
    })
    console.log(this.data.info)
    console.log(this.data.title)

  if(this.data.title.length == 0)
  {
    wx.showToast({
      title: '请填写标题',
      icon: "none",
      duration: 2000,
      mask: true
    })
    return false
  }
    const db = wx.cloud.database();
    //更新记录即可。
    db.collection('notice').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        title: this.data.title,
        content:this.data.info,
        teacherId: app.globalData.id_for_switch_tab,
        time: util.formatTime(new Date),
      },
      success(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
      }
    })










    
    wx.showToast({
      title: '恭喜发布成功,请稍后刷新..',
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