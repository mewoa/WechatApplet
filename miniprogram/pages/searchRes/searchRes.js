// pages/searchRes/searchRes.js
Page({

  /**
   * 页面的初始数据
   */
  data: 
  {
    isLoad: false,
    clientHeight: 0, 
    scrollLeft: 0,
    lists:["课程","知识","通知"],
    TabCur: 0,
    scrollLeft: 0,
    course:[],
    knowledge:[],
    info:[]
  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },

  /*swiper切换index*/
  switchSwiper: function (e) {
    var that = this;
    that.setData({
      TabCur: e.detail.current,
      scrollLeft: (e.detail.current - 1) * 60
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) 
  {
    var that = this
    const db = wx.cloud.database();
    console.log(options)
    this.setData({
      key: options.key
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        })
      }
    })
    //查询各个分类信息
    db.collection("course").where({
      courseName: db.RegExp({
        regexp: that.data.key,
        options: 'i',
      })
    }).get().then(res =>{
      that.setData({
        course:res.data
      })
      //转换图片
      for (let i = 0; i < that.data.course.length; i++) {
        wx.cloud.getTempFileURL({
          fileList: [that.data.course[i].imagePath],
          success: res => {
            // get temp file URL
            that.data.course[i].imagePath = res.fileList[0].tempFileURL
            that.setData({
              course: that.data.course
            })
            console.log("---", that.data.cyy[i].imagePath)
          }
        })
      }
      console.log(res.data)
    })

    db.collection("file").where({
      fileName: db.RegExp({
        regexp: that.data.key,
        options: 'i',
      })
    }).get().then(res => {
      that.setData({
        knowledge:res.data
      })
      console.log(res.data)
    })

    db.collection("notice").where({
      title: db.RegExp({
        regexp: that.data.key,
        options: 'i',
      })
    }).get().then(res => {
      that.setData({
        info: res.data
      })
      console.log(res.data)
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

browse:function(e)
{

console.log(e)
  const downloadTask = wx.cloud.downloadFile({
    fileID: e.currentTarget.id,
    success: res => {
      // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
      if (res.statusCode === 200) {
        //更新数据库的下载次数
        console.log(res.tempFilePath)
        const filePath = res.tempFilePath
        wx.showToast({
          title: '正在打开文件',
          icon: 'loading',
          duration: 2000
        })

        setTimeout(function () {
          wx.openDocument({
            filePath,
            success(res) {
              console.log('打开文档成功')
            }
          })
          //要延时执行的代码
        }, 2000)
      }
      else {
        wx.showToast({
          title: '失败',
          icon: 'none',
          duration: 2000
        })

      }
    },
    fail: err => {
      console.log(err)
    }
  })

  downloadTask.onProgressUpdate((res) => {
    if (res.progress === 100) {
      this.setData({
        progress: ''
      })
    } else {
      this.setData({
        progress: res.progress + '%'
      })
    }
    wx.showToast({
      title: "正在打开:" + this.data.progress,
      icon: "none"
    })
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