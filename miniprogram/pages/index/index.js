//index.js
const app = getApp()
const { $Message } = require('../../dist/base/index');
Page({
  data: {
    /*与wxml一起参与页面渲染的数据*/
    courseArray: ['../../images/yd1.png', '../../images/yd2.png', '../../images/yd3.png'],
   
    /*从数据库读取数据到courses中，在wxml中循环显式*/
    courses:[],
    id:"",
    inputValue:"",
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    byyl: [],
    rjgc: [],
    sjjg: [],
    c: [],
    notice: [],
    cardCur: 0,
    kng:[]
  },

  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value//将input至与data中的inputValue绑定
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
infoDetail:function(e)
{
  
  
  wx.navigateTo({
    url: '../info_dt/info_dt?title=' + e.currentTarget.dataset.title + '&content=' + e.currentTarget.dataset.content + '&teacher=' + e.currentTarget.dataset.teacher + '&time=' + e.currentTarget.dataset.time
  })
  
},
  submit: function (e) 
  {
      wx.navigateTo({
        url: '../searchRes/searchRes?key='+ this.data.inputValue
    })
    this.setData({
      inputValue: ""
    })

  },

  refresh: function (e) {
    this.onLoad()
    wx.showToast({
      title: '刷新成功',
      icon: 'success',
      duration: 1000
    })

  },

  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  onLoad: function(options) {
    var that = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    /* 页面渲染显式后执行此函数 */
    this.setData({
      id: app.globalData.id_for_switch_tab
    })
    if (!wx.cloud) 
    {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    /*
     * 从数据库获取数据到courses变量中
     */
    const db = wx.cloud.database();
    console.log("获取到的账号：", this.data.id)
    db.collection('course').orderBy('hot', 'desc').get().then(res =>{
      
      
      this.setData({
        courses: res.data,
      })

      for (let i = 0; i < that.data.courses.length; i++) {
        wx.cloud.getTempFileURL({
          fileList: [that.data.courses[i].imagePath],
          success: res => {
            // get temp file URL
            that.data.courses[i].imagePath = res.fileList[0].tempFileURL
            that.setData({
              courses: that.data.courses
            })
            console.log("---", that.data.cyy[i].imagePath)
          }
        })
      }







        console.log('[数据库][查询] 成功：', res)
        })
        .catch(err=>{
          wx.showToast({
            icon:'none',
            title: '查询记录失败',
          })
          console.error('[数据库][查询] 失败',err)
        })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })

    db.collection('notice').get().then(res => {
      this.setData({
        notice: res.data
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

    db.collection('file').where({ category: "编译原理" }).orderBy('downloadTimes', 'desc').get().then(res => {
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

    db.collection('file').where({ category: "软件工程" }).orderBy('hot', 'desc').get().then(res => {
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

    db.collection('file').where({ category: "数据结构" }).orderBy('hot', 'desc').get().then(res => {
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


    db.collection('file').orderBy('uploadDate', 'desc').get().then(res => {
      this.setData({
        kng: res.data,
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









    db.collection('file').where({ category: "c" }).orderBy('hot', 'desc').get().then(res => {
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
  },

  onShow() { //返回显示页面状态函数
    
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
    
    
    //错误处理
    //正确方法
    //只执行获取地址的方法，来进行局部刷新
  },

  onGetUserInfo: function(e) {
    wx.cloud.callFunction({
      name:'add',
      success(res)
      {
        // res.data 包含该记录的数据, 多条数据使用res.result.data
        console.log(res.result.data)
      }
      })

    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }

   
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },


  toCourse: function () {
    wx.navigateTo({
      url: '../course/course'
    })
  },

  //跳转到学习页面
  detail:function(e)
  { 
    //更新数据库
    console.log(e.currentTarget.dataset.courseid)
    var _id = e.currentTarget.id
    wx.cloud.callFunction({
      name: 'update',
      data: {
        docid: _id,
        collectionName:'course',
        field:'hot'
      },
      success: function (res) {
        console.log(res)
      }, fail: function (res) {
        console.log(res)
      }
    })
    this.onShow()
    wx.navigateTo({
      url: '../videoPlay/videoPlay?courseId=' + e.currentTarget.dataset.courseid + "&parts=" + e.currentTarget.dataset.parts,
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        console.log("cloudPath:", cloudPath)
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },


  browse: function (options) {
    var that = this;
    that.handleSuccess();
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
          //更新数据库的下载次数
          this.onLoad()
          wx.showToast({
            title: '下载成功,文件保存到' + res.tempFilePath,
            icon: 'none',
            duration: 4000
          })
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
  onReady: function () {
    wx.hideLoading()
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
          this.onLoad()
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

  }















})
