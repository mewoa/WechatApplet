// pages/history/history.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: 
  {
    learnHistory:[],
    studentId:"",
    courseDetail:[],
    isLoad:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) 
  {
    var that = this
    //根据学号获取所有学习记录
    const db = wx.cloud.database();
    db.collection('history').where({ studentId: app.globalData.id_for_switch_tab }).orderBy('lastTime','desc').get().then(res => {
      this.setData({
        learnHistory:res.data,
        isLoad:true
      })
      if(res.data.length == 0){ 
        wx.showToast({
          title: '加载完成-没有更多数据!',
          duration:2000,
          icon:'none'
        })
      }
      console.log(this.data.learnHistory)
      //根据获取的课程Id,获取课程的详细信息
      var tmp = []
      for(let j = 0; j < res.data.length; j++)
      {
        tmp.push([])
      }
      for(let i = 0; i < res.data.length; i++)
      {
        db.collection('course').where({courseId:this.data.learnHistory[i].courseId}).get().then(res =>{
          tmp[i].push(res.data[0])
          console.log(tmp)
          //修改图片路径
          wx.cloud.getTempFileURL({
            fileList: [tmp[i][0].imagePath],
            success: res => {
              // get temp file URL
              tmp[i][0].imagePath = res.fileList[0].tempFileURL
              that.setData({
                courseDetail: tmp
              })
              console.log("getcourseDEtail:", this.data.courseDetail)
            }
        })
    })
  }
    })
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  
  refresh: function (e) {
    this.onLoad()
    wx.showToast({
      title: '刷新成功',
      icon: 'success',
      duration: 1000
    })

  },

  videoPlay:function(e)
  {
    wx.navigateTo({
      url: '../videoPlay/videoPlay?courseId='+ e.currentTarget.dataset.courseid + '&parts='+ e.currentTarget.dataset.parts,
    })
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