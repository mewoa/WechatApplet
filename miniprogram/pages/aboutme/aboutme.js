// pages/aboutme/aboutme.js
const app = getApp()
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    student:"",
    gridCol: 3,
    skin: false,
    userInfo:{},
    visible4: false,
    actions4: [
      {
        name: '课程视频',
        color: '#ff9900'
      },
      {
        name: '课件',
        color: '#ff9900'
        
      },
      {
        name: '关闭'

      }
    ],



    visible5: false,
    actions5: [
      {
        name: '通知',
        color: '#ff9900'
      },
      {
        name: '课件',
        color: '#ff9900'

      },
      {
        name: '课程',
        color: '#ff9900'
      },
      {
        name:"关闭"
      }
    ],
  },
  uploadInfo(e)
  {
    wx.navigateTo({
      url: '../uploadInfo/uploadInfo?teacherId=' + app.globalData.id_for_switch_tab
    })
  },




  handleClick4(e) {
    this.setData({
      visible4: false
    });
  if(e.detail.index == 0)
  {
    wx.navigateTo({
      url: '../uploadCourse/uploadCourse?teacherId=' + app.globalData.id_for_switch_tab
    })
  }
  else if(e.detail.index == 1)
  {
    wx.navigateTo({
      url: '../uploadFile/uploadFile?teacherId=' + app.globalData.id_for_switch_tab
    })

  }
  else
    this.setData({
      visible4: false
    });



  },


  handleClick5(e) {
    this.setData({
      visible5: false
    });
    if (e.detail.index == 0) {
      wx.navigateTo({
        url: '../allManage/allManage?index='+ 0
      })
    }
    else if (e.detail.index == 1) {
      wx.navigateTo({
        url: '../allManage/allManage?index='+ 1
      })

    }

    else if(e.detail.index == 2)
    {

      wx.navigateTo({
        url: '../allManage/allManage?index=' + 2
      })
    }
    else
      this.setData({
        visible5: false
      });



  },

  manageChoose()
  {
    this.setData({
      visible5: true
    });
  },


  uploadChoose() {
    this.setData({
      visible4: true
    });
  },

  quit(e) {
    wx.showToast({
      title: 'Loading',
      icon: 'loading',
      duration: 1000
    })
    setTimeout(function () {
      wx.redirectTo({
        url: '../login/login'
      })
      //要延时执行的代码
    }, 1000)
  },

  uploadCourse:function(options)
  {
    wx.navigateTo({
      url: '../uploadCourse/uploadCourse?teacherId='+ app.globalData.id_for_switch_tab
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      student:app.globalData.student
    }),


    db.collection('student').where({ studentId: app.globalData.id_for_switch_tab}).get().then(res => {
      this.setData({
          userInfo:res
      })
      console.log("userInfo", this.data.userInfo)
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

  },
  
  historyCheck:function(e)
  {
    wx.navigateTo({
      url: '../history/history'
  })
  }
})