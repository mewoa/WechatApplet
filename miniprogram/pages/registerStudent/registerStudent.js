// pages/registerStudent/registerStudent.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gradeArray:['大一','大二','大三', '大四'],
    gradeIndex:0,
    majorArray:['计算机科学与技术','软件工程','土木工程','通信技术'],
    majorIndex:0,
    sexArray:['男','女'],
    sexIndex:0
  },

  bindPickerChangeGrade: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      gradeIndex: e.detail.value
    })
  },
  bindPickerChangeMajor: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      majorIndex: e.detail.value
    })
  },
  bindPickerChangeSex: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      sexIndex: e.detail.value
    })
  },
  
  //注册验证和写入数据库
  formSubmit: function (e) {
    if (e.detail.value.id.length === 0 || e.detail.value.name.length === 0 || e.detail.value.password.length === 0 || e.detail.value.passwordConfirm.length === 0 ){
      wx.showToast({
        title: '请填写所有信息',
        icon: 'none',
        duration: 1500
      })
    }
    else if(e.detail.value.passwordConfirm !== e.detail.value.password)
    {
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none',
        duration: 1500
      })
    }
    else
    {
      const db = wx.cloud.database();
      //1.查询是否存在id
      db.collection('student').where({ studentId: e.detail.value.id}).get().then(res => {
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
          db.collection('student').add({
            data: {
                    studentId:e.detail.value.id,
                    name:e.detail.value.name,
                    grade:this.data.gradeArray[this.data.gradeIndex],
                    sex:this.data.sexArray[this.data.sexIndex],
                    password:e.detail.value.password,
                    major:this.data.majorArray[this.data.majorIndex]
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