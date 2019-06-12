// pages/course/course.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoad:false,
    clientHeight: 0,
    lists: [
      "C语言", "编译原理", "数据结构", "软件工程", "计算机网络", "汇编原理", "电路原理", "linux", "数电技术", "操作系统","..."
    ],
    cyy: [],
    byyl: [],
    sjjg: [],
    rjgc: [],
    jsjwl: [],
    hbyl:[],
    dlyl: [],
    linux:[],
    sdjs:[],
    czxt:[],
    TabCur: 0,
    scrollLeft: 0
  },
  
  refresh: function (e) {
    this.onLoad()
    wx.showToast({
      title: '刷新成功',
      icon: 'success',
      duration: 1000
    })

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
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        })
      }
    })

    //将背景图云函数路径转URL
    const db = wx.cloud.database();
    db.collection('course').where({ category: "c语言" }).orderBy('downloadTimes', 'desc').get().then(res => {
      this.setData({
        cyy: res.data
      })
      for (let i = 0; i < that.data.cyy.length; i++) {
        wx.cloud.getTempFileURL({
          fileList: [that.data.cyy[i].imagePath],
          success: res => {
            // get temp file URL
            that.data.cyy[i].imagePath = res.fileList[0].tempFileURL
            that.setData({
              cyy: that.data.cyy
            })
            console.log("---", that.data.cyy[i].imagePath) 
          }
        })
      }
      console.log('[数据库][查询] 成功：', res)
    })
      .catch(err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败',
        })
        console.error('[数据库][查询] 失败', err)
      })
      

    db.collection('course').where({ category: "编译原理" }).orderBy('downloadTimes', 'desc').get().then(res => {
      this.setData({
      byyl: res.data
      })
      for (let i = 0; i < that.data.byyl.length; i++) {
        wx.cloud.getTempFileURL({
          fileList: [that.data.byyl[i].imagePath],
          success: res => {
            // get temp file URL
            that.data.byyl[i].imagePath = res.fileList[0].tempFileURL
            that.setData({
              byyl: that.data.byyl
            })
          }
        })
      }








      console.log('[数据库][查询] 成功：', res)
    })
      .catch(err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败',
        })
        console.error('[数据库][查询] 失败', err)
      })


    db.collection('course').where({ category: "数据结构" }).orderBy('downloadTimes', 'desc').get().then(res => {
      this.setData({
        sjjg: res.data
      })

      for (let i = 0; i < that.data.sjjg.length; i++) {
        wx.cloud.getTempFileURL({
          fileList: [that.data.sjjg[i].imagePath],
          success: res => {
            // get temp file URL
            that.data.sjjg[i].imagePath = res.fileList[0].tempFileURL
            that.setData({
              sjjg: that.data.sjjg
            })
          }
        })
      }





      console.log('[数据库][查询] 成功：', res)
    })
      .catch(err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败',
        })
        console.error('[数据库][查询] 失败', err)
      })

    db.collection('course').where({ category: "软件工程" }).orderBy('downloadTimes', 'desc').get().then(res => {
      this.setData({
        rjgc: res.data
      })

      for (let i = 0; i < that.data.rjgc.length; i++) {
        wx.cloud.getTempFileURL({
          fileList: [that.data.rjgc[i].imagePath],
          success: res => {
            // get temp file URL
            that.data.rjgc[i].imagePath = res.fileList[0].tempFileURL
            that.setData({
              rjgc: that.data.rjgc
            })
          }
        })
        }
      console.log('[数据库][查询] 成功：', res)
    })
      .catch(err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败',
        })
        console.error('[数据库][查询] 失败', err)
      })

    db.collection('course').where({ category: "计算机网络" }).orderBy('downloadTimes', 'desc').get().then(res => {
      this.setData({
        jsjwl: res.data
      })
      for (let i = 0; i < that.data.jsjwl.length; i++) {
        wx.cloud.getTempFileURL({
          fileList: [that.data.jsjwl[i].imagePath],
          success: res => {
            // get temp file URL
            that.data.jsjwl[i].imagePath = res.fileList[0].tempFileURL
            that.setData({
              jsjwl: that.data.jsjwl
            })
          }
        })
      }


      console.log('[数据库][查询] 成功：', res)
    })
      .catch(err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败',
        })
        console.error('[数据库][查询] 失败', err)
      })

    db.collection('course').where({ category: "汇编原理" }).orderBy('downloadTimes', 'desc').get().then(res => {
      this.setData({
        hbyl: res.data
      })
      for (let i = 0; i < that.data.hbyl.length; i++) {
        wx.cloud.getTempFileURL({
          fileList: [that.data.hbyl[i].imagePath],
          success: res => {
            // get temp file URL
            that.data.hbyl[i].imagePath = res.fileList[0].tempFileURL
            that.setData({
              hbyl: that.data.hbyl
            })
          }
        })
      }
      




      console.log('[数据库][查询] 成功：', res)
    })
      .catch(err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败',
        })
        console.error('[数据库][查询] 失败', err)
      })


    db.collection('course').where({ category: "电路原理" }).orderBy('downloadTimes', 'desc').get().then(res => {
      this.setData({
        dlyl: res.data
      })

      for (let i = 0; i < that.data.dlyl.length; i++) {
        wx.cloud.getTempFileURL({
          fileList: [that.data.dlyl[i].imagePath],
          success: res => {
            // get temp file URL
            that.data.dlyl[i].imagePath = res.fileList[0].tempFileURL
            that.setData({
              dlyl: that.data.dlyl
            })
          }
        })
      }





      console.log('[数据库][查询] 成功：', res)
    })
      .catch(err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败',
        })
        console.error('[数据库][查询] 失败', err)
      })

    db.collection('course').where({ category: "linux" }).orderBy('downloadTimes', 'desc').get().then(res => {
      this.setData({
        linux: res.data
      })
      for (let i = 0; i < that.data.linux.length; i++) {
        wx.cloud.getTempFileURL({
          fileList: [that.data.linux[i].imagePath],
          success: res => {
            // get temp file URL
            that.data.linux[i].imagePath = res.fileList[0].tempFileURL
            that.setData({
              linux: that.data.linux
            })
          }
        })
      }



      console.log('[数据库][查询] 成功：', res)
    })
      .catch(err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败',
        })
        console.error('[数据库][查询] 失败', err)
      })

    db.collection('course').where({ category: "数电技术" }).orderBy('downloadTimes', 'desc').get().then(res => {
      this.setData({
        sdjs: res.data
      })

      for (let i = 0; i < that.data.sdjs.length; i++) {
        wx.cloud.getTempFileURL({
          fileList: [that.data.sdjs[i].imagePath],
          success: res => {
            // get temp file URL
            that.data.sdjs[i].imagePath = res.fileList[0].tempFileURL
            that.setData({
              sdjs: that.data.sdjs
            })
          }
        })
      }


      console.log('[数据库][查询] 成功：', res)
    })
      .catch(err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败',
        })
        console.error('[数据库][查询] 失败', err)
      })

    db.collection('course').where({ category: "操作系统" }).orderBy('downloadTimes', 'desc').get().then(res => {
      this.setData({
        isLoad:true,
        czxt: res.data
      })
      for (let i = 0; i < that.data.czxt.length; i++) {
        wx.cloud.getTempFileURL({
          fileList: [that.data.czxt[i].imagePath],
          success: res => {
            // get temp file URL
            that.data.czxt[i].imagePath = res.fileList[0].tempFileURL
            that.setData({
              czxt: that.data.czxt
            })
          }
        })
      }









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