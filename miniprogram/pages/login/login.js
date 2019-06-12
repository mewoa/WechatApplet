// pages/login/login.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showDialog:false,
    id:"",
    password:"",
    radio:"student",
    Radio:"student",
    result : ""
  },

  // 获取输入账号
  idInput: function (e) {
    this.setData({
      id: e.detail.value
    })
  },

 //获取密码
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

 passwordInput :function (e) {
    this.setData({
      password:e.detail.value
    })
  },

  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.setData({
      radio: e.detail.value
    })
  },
  radioChanges(e) {
    console.log('Radio发生change事件，携带value值为：', e.detail.value);
    this.setData({
      Radio: e.detail.value
    })
  },

  cancel: function () {
    this.setData({
      showDialog: !this.data.showDialog
    })
  },
  confirm: function () {
    this.setData({
      showDialog: !this.data.showDialog
    })
    if (this.data.Radio === "teacher")
      {
        wx.navigateTo({
        url: '../registerTeacher/registerTeacher'
      })
      }
    else
    {
      wx.navigateTo({
        url: '../registerStudent/registerStudent'
      })
    }
  },




//表单验证
  login: function () {
    const db = wx.cloud.database();
    if (this.data.id.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: '请填写账号和密码!',
        icon: 'none',
        duration: 1500
      })
    } 
    else if(this.data.radio === "teacher")   //使用云函数失败了
    {
      db.collection('teacher').where({teacherId:this.data.id,password:this.data.password}).get().then(res => {
          if(res.data.length === 1)
            {
              console.log('[数据库][查询] 成功：', res)
            app.globalData.courseTeach = res.data[0].courseTeach
              app.globalData.student = false
              app.globalData.id_for_switch_tab = this.data.id
            // 这里修改成跳转的页面
              wx.showToast({
              title: 'Loading...',
              icon: 'loading',
              duration: 2000
            })
            var that = this
              setTimeout(function () {
                wx.switchTab({
                  url: '../index/index'
                })
              //要延时执行的代码
            }, 2000)  
            }
          else
            {
              console.log('[数据库][查询] 失败：', res)
              wx.showToast({
              title: '账号或密码错误!',
              icon: 'none',
              duration: 1500
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
    else if (this.data.radio === "student")
    {
      db.collection('student').where({ studentId: this.data.id, password: this.data.password }).get().then(res => {
        if (res.data.length === 1) {
          console.log('[数据库][查询] 成功：', res)
          // 这里修改成跳转的页面

          //设置全局变量
          app.globalData.student = true
          app.globalData.id_for_switch_tab = this.data.id

          wx.showToast({
            title: 'Loading...',
            icon: 'loading',
            duration: 2000
          })
          var that = this
          setTimeout(function () {
            wx.switchTab({
              url: '../index/index'
            })
            //要延时执行的代码
          }, 2000)
        }
        else {
          console.log('[数据库][查询] 失败：', res)
          wx.showToast({
            title: '账号或密码有误!',
            icon: 'none',
            duration: 1500
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

    // openid 不一致不允许更新
    // const db = wx.cloud.database()
    // db.collection('student').doc('XKL3N8DR1TiNR-gO').update({
    //   data:
    //   {
    //     name: "tyuioiuytjkjhghjkjh"
    //   },
    //   success: res => {
    //     console.log('[数据库] [更新记录] 成功：', res)
    //   },
    //   fail: err => {
    //     icon: 'none',
    //       console.error('[数据库] [更新记录] 失败：', err)
    //   }
    // })


  },


  register: function (options) {
    this.setData({
      showDialog: !this.data.showDialog
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