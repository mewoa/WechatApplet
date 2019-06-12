// pages/knowledge/knowledge.js
var util = require('../../utils/util.js')
const db = wx.cloud.database()
const _ = db.command
const app = getApp()
const { $Message } = require('../../dist/base/index');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLoad: false,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    list: ["C语言", "编译原理", "数据结构", "软件工程", "网络通信", "汇编原理", "电路原理", "linux", "数电技术", "操作系统"],
    load: true,
      currentTab:0,
      flag:0,
    cyy:[],
    byyl: [],
    sjjg: [],
    rjgc: [],
    jsjwl: [],
    hbyl: [],
    dlyl: [],
    linux: [],
    sdjs: [],
    czxt: [],

      progress:"",
      current_scroll:"tab1",
      tab1:true,
    tab2: false,
    tab3: false,
    tab4: false,
    tab5: false,
    hidden:false,
    visible5: false,
    actions5: [
      {
        name: '在线浏览',
        color: '#ff9900'
      },
      {
        name: '下载到本地',
        color: '#ff9900'

      },
      {
        name: "取消"
      }
    ],
  },


  browse(options) {
    console.log(options)
    this.setData({
      visible5:true,
      docid:options.currentTarget.dataset.record,
      file:options.currentTarget.id
    });

  },

  handleClick5({ detail }) {
    var that = this
    const index = detail.index;
    if (index === 0) {
      //直接打开
      const downloadTask = wx.cloud.downloadFile({
        fileID: that.data.file,
        success: res => {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            //更新数据库的下载次数
            console.log(res.tempFilePath)
            const filePath = res.tempFilePath
            this.onLoad()
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
    }
    else if (index === 1) {
      //只下载，并显式下载路径
      wx.cloud.callFunction({
        name: 'update',
        data: {
          docid: that.data.docid,
          collectionName: 'file',
          field: 'downloadTimes'
        },
        success: function (res) {
          console.log(res)
        }, fail: function (res) {
          console.log(res)
        }
      })

      const downloadTask = wx.cloud.downloadFile({
        fileID: that.data.file,
        success: res => {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            //更新数据库的下载次数
            console.log(res.tempFilePath)
            const filePath = res.tempFilePath
            this.onLoad()
            wx.showToast({
              title: '下载成功，已经保存到如下地址：'+ filePath,
              icon: 'none',
              duration: 3000
            })
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
          title: "正在下载:" + this.data.progress,
          icon: "none"
        })
      })
    }
    this.setData({
      visible5: false
    });
  },
  refresh:function(e)
  {
    this.onLoad()
    wx.showToast({
      title: '刷新成功',
      icon: 'success',
      duration: 1000
    })

  },

  handleSuccess() {
    $Message({
      content: '文件即将打开...',
      type: 'success'
    });
  },
  handleSuccess2() {
    $Message({
      content: '即将开始下载...',
      type: 'success'
    });
  },


  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current,
      flag:e.detail.current
    });
  },


  onShow() { //返回显示页面状态函数
    //错误处理
    //正确方法
    //只执行获取地址的方法，来进行局部刷新
  },




  download: function (options) {
    this.handleSuccess2();
    var _id = options.target.dataset.record
    wx.cloud.callFunction({
      name: 'update',
      data: {
        docid: _id,
        collectionName: 'file',
        field: 'downloadTimes'
      },
      success: function (res) {
        console.log(res)
      }, fail: function (res) {
        console.log(res)
      }
    })
    const downloadTask = wx.cloud.downloadFile({
      fileID: options.target.id,
      success: res => {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          wx.showToast({
            title: '下载成功,文件保存到' + res.tempFilePath,
            icon: 'none',
            duration: 4000
          })
          console.log(res.tempFilePath)
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
        title: "正在下载:" + this.data.progress,
        icon: "none"
      })
    })
  },





  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    /*
     * 查询所有信息
     */
    const db = wx.cloud.database();
    db.collection('file').where({ category: "c语言" }).get().then(res => {
      this.setData({
        isLoad: true,
        cyy:res.data
      })
      console.log('[数据库][查询] 成功：', res)
    })
      .catch(err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败',
        })
        console.error('[数据库][查询] 失败', err)
      })





    db.collection('file').where({ category: "编译原理" }).get().then(res => {
      this.setData({
        byyl: res.data
      })
      console.log('[数据库][查询] 成功：', res)
    })
      .catch(err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败',
        })
        console.error('[数据库][查询] 失败', err)
      })

    db.collection('file').where({ category: "软件工程" }).get().then(res => {
      this.setData({
        rjgc: res.data,
      })
      console.log('[数据库][查询] 成功：', res)
    })
      .catch(err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败',
        })
        console.error('[数据库][查询] 失败', err)
      })

    db.collection('file').where({ category: "数据结构" }).get().then(res => {
      this.setData({
        sjjg: res.data,
      })
      console.log('[数据库][查询] 成功：', res)
    })
      .catch(err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败',
        })
        console.error('[数据库][查询] 失败', err)
      })

    db.collection('file').where({ category: "c" }).get().then(res => {
      this.setData({
        c: res.data,
      })
      console.log('[数据库][查询] 成功：', res)
    })
      .catch(err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败',
        })
        console.error('[数据库][查询] 失败', err)
      })


    db.collection('file').where({ category: "计算机网络" }).get().then(res => {
      this.setData({
        jsjwl: res.data,
      })
      console.log('[数据库][查询] 成功：', res)
    })
      .catch(err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败',
        })
        console.error('[数据库][查询] 失败', err)
      })


    db.collection('file').where({ category: "汇编原理" }).get().then(res => {
      this.setData({
        hbyl: res.data,
      })
      console.log('[数据库][查询] 成功：', res)
    })
      .catch(err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败',
        })
        console.error('[数据库][查询] 失败', err)
      })



    db.collection('file').where({ category: "电路原理" }).get().then(res => {
      this.setData({
        dlyl: res.data,
      })
      console.log('[数据库][查询] 成功：', res)
    })
      .catch(err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败',
        })
        console.error('[数据库][查询] 失败', err)
      })


    db.collection('file').where({ category: "Linux" }).get().then(res => {
      this.setData({
        linux: res.data,
      })
      console.log('[数据库][查询] 成功：', res)
    })
      .catch(err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败',
        })
        console.error('[数据库][查询] 失败', err)
      })


    db.collection('file').where({ category: "数电技术" }).get().then(res => {
      this.setData({
        sdjs: res.data,
      })
      console.log('[数据库][查询] 成功：', res)
    })
      .catch(err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败',
        })
        console.error('[数据库][查询] 失败', err)
      })


    db.collection('file').where({ category: "操作系统" }).get().then(res => {
      this.setData({
        czxt: res.data,
      })
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

    let lists = [{}];
    for (let i = 0; i < 10; i++) {
      lists[i] = {};
      lists[i].name = this.data.list[i];
      lists[i].id = i;
    }
    console.log(lists)
    this.setData({
      list: lists,
      listCur: lists[0]
    })
    var that = this;
    setTimeout(function () {
      that.setData({
        hidden: true
      })
      //要延时执行的代码
    }, 1800)
  },

  
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },

  //滑动右边，左边跟着滑动
  VerticalMain(e) {
    let that = this;
    let list = this.data.list;
    let tabHeight = 0;
    
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + list[i].id);
        view.fields({
          size: true
        }, data => {
          console.log(data)
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          list[i].bottom = tabHeight;
        }).exec();
      }
      that.setData({
        load: false,
        list: list
      })
    }



    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        return false
      }
    }
  },





  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () 
  {
    
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
  onPullDownRefresh: function () 
  {
    this.onLoad()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1500)

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