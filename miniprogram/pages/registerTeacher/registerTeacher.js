// pages/registerTeacher/registerTeacher.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexArray:['男','女'],
    sexIndex:0,
    course:[]
  },

  bindPickerChangeSex: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      sexIndex: e.detail.value
    })
  },

  checkboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.setData({
        course:e.detail.value
    })
  },


  formSubmit: function (e) {
    if (e.detail.value.id.length === 0 || e.detail.value.name.length === 0 || e.detail.value.password.length === 0 || e.detail.value.passwordConfirm.length === 0 ||e.detail.value.lock.length === 0) {
      wx.showToast({
        title: '请填写所有信息',
        icon: 'none',
        duration: 1500
      })
    }
    else if (e.detail.value.passwordConfirm !== e.detail.value.password) {
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none',
        duration: 1500
      })
    }
    else if (e.detail.value.lock !== "1234") {
      wx.showToast({
        title: '注册码错误',
        icon: 'none',
        duration: 1000
      })
    }
    else {
      const db = wx.cloud.database();
      
      //1.查询是否存在id
      db.collection('teacher').where({ teacherId: e.detail.value.id }).get().then(res => {
        if (res.data.length === 1) {
          console.log('[数据库][查询] 成功：', res)
          // 这里修改成跳转的页面
          wx.showToast({
            title: '用户已经存在',
            icon: 'none',
            duration: 2000
          })
        }
        
        else {
          console.log('[数据库][查询] 失败：', res)
          db.collection('teacher').add({
            data: {
              teacherId: e.detail.value.id,
              name: e.detail.value.name,
              sex: this.data.sexArray[this.data.sexIndex],
              password: e.detail.value.password,
              courseTeach:this.data.course
            },
            success: res => {
              wx.showToast({
                title: '注册成功',
                duration: 2000
              })
              setTimeout(function () {
                wx.redirectTo({
                  url: '../login/login'
                })
                //要延时执行的代码
              }, 2000)
              console.log('[数据库] [新增记录] 成功，记录 _id: ', res)
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '新增记录失败'
              })
              console.error('[数据库] [新增记录] 失败：', err)
            }
          })
        }
      })
        .catch(err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败',
          })
          console.error('[数据库][查询] 失败', err)
        })
    }
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