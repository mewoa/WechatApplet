// pages/allManage/allManage.js
const app = getApp()
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoad:false,
    idTmp:"",
    courseidTmp:"",
    courseName:"",
    courseInfo:"",
    empty:true,
    empty2: true,
    clientHeight: "",
    TabCur: 0,
    TabCur2: 0,
    tmpIndex:[],
    tmpIndex2:[],
    scrollLeft: 0,
    scrollLeft2: 0,
    courseTeach:[],
    fileDetail:[],
    courseDetail:[],
    fileTmp:[],
    courseTmp:[],
    infoDetail:[],
    visible3: false,
    teacherId:"",
    index : "",
    actions3: [
      {
        name: '编辑',
        color: '#2d8cf0',
      },
      {
        name: '删除',
        color: 'red'
      },
      {
        name: '取消'
      }
    ],



    visible5: false,
    actions5: [
      {
        name: '删除这个课程',
        color: '#ff9900'
      },
      {
        name: '修改简介信息',
        color: '#ff9900'

      },
      {
        name: "关闭"
      }
    ],

  },
  courseOption(e)
  {
    console.log(e)
    this.setData({
      visible5:true,
      courseidTmp:e.target.dataset.courseid,
      idTmp:e.target.dataset.id,
      courseName: e.target.dataset.coursename,
      courseInfo: e.target.dataset.courseinfo
    });
    console.log("courseId",this.data.courseidTmp)
    console.log("record-id", this.data.idTmp)
  },

  handleClick5({detail}) 
  {
    console.log(detail)
    const index = detail.index;
    this.setData({
      visible5: false
    });
  //根据index执行不同的操作
  if(index == 0)
  {
    console.log("index == 0")
    //删除这个课程信息
    //1.删除course表
    const db = wx.cloud.database()

    wx.cloud.callFunction({
      name: 'remove',
      data: {
        docid: this.data.idTmp,
        collectionName: 'course'
      },
      success: function (res) {
        console.log(res)
      }, fail: function (res) {
        console.log(res)
      }
    })

    //2.删除Manage表
    db.collection('videoManage').where({ courseId: this.data.courseidTmp, teacherId: this.data.teacherId}).get().then(res => {
      console.log("res of delete videoManage", res)
      if (res.data.length == 1) {
        wx.cloud.callFunction({
          name: 'remove',
          data: {
            docid: res.data[0]._id,
            collectionName: 'videoManage'
          },
          success: function (res) {
            console.log(res)
          }, fail: function (res) {
            console.log(res)
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

  //3.删除video表
    wx.cloud.callFunction({
      name: 'removeSeveral',
      data: {
        courseId:this.data.courseidTmp,
        collectionName: 'video'
      },
      success: function (res) {
        console.log(res)
      }, fail: function (res) {
        console.log(res)
      }
    })

    //4.提示删除成功
    wx.showToast({
      title: '恭喜删除成功',
      icon: 'succes',
      duration: 2000,
      mask: true
    })
  }

  else if(index == 1)
  {
    //修改课程简介信息,传递记录id,即可
    wx.navigateTo({
      url: '../modifyCourse/modifyCourse?record=' + this.data.idTmp + "&courseName=" + this.data.courseName + "&courseInfo="+this.data.courseInfo,
    })
    console.log("index == 1")
  }
  else
  {
    console.log("index == 2")
  }


  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  tabSelect2(e) {
    this.setData({
      TabCur2: e.currentTarget.dataset.id,
      scrollLeft2: (e.currentTarget.dataset.id - 1) * 60
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
  switchSwiper2: function (e) {
    var that = this;
    that.setData({
      TabCur2: e.detail.current,
      scrollLeft2: (e.detail.current - 1) * 60
    });
  },

  handleSuccess() {
    $Message({
      content: '文件即将打开...',
      type: 'success'
    });
  },

  handleSuccessp() {
    $Message({
      content: '文件删除成功',
      type: 'success'
    });
  },
  
option:function(e){
  console.log(e)
  this.setData({
    visible3: true,
    docid:e.currentTarget.dataset.docid,
    infoInd:e.currentTarget.dataset.ind,
    infoContent:e.currentTarget.dataset.infocontent
  });
},
  handleClick3({detail}) {
    var that = this
    const index = detail.index;
    if (index === 0) 
    {
      
      //进行编辑，传入通知的_id和内容
      wx.navigateTo({
        url: '../modifyInfo/modifyInfo?docid=' + this.data.docid + "&infoContent=" + this.data.infoContent
      })

    }
    else if (index === 1) 
    {
      
      wx.cloud.callFunction({
        name: 'remove',
        data: {
          docid: that.data.docid,
          collectionName: 'notice'
        },
        success: function (res) {
          wx.showLoading({
            title: '删除成功',
            duration:1000
          })
          that.data.infoDetail.splice(that.data.infoInd, 1)
          that.setData({
            infoDetail:that.data.infoDetail
          })
          console.log(res)
          //
        }, fail: function (res) {
          console.log(res)
        }
      })
    }
    this.setData({
      visible3: false
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */

  delete:function(options){

console.log("delete",options)
    var that = this;
    that.handleSuccessp();
    
    //记录id,删除file表
    var _id = options.target.dataset.record

    //文件id，删除文件和fileManage表
    console.log(options.target.dataset.fid)
    var fId = options.target.dataset.fid

    const db = wx.cloud.database()
    
    wx.cloud.callFunction({
      name: 'remove',
      data: {
        docid: _id,
        collectionName: 'file'
      },
      success: function (res) {
        console.log(res)
      }, fail: function (res) {
        console.log(res)
      }
    })

    //删除fileManage
    db.collection('fileManage').where({ fileId: fId, teacherId:this.data.teacherId}).get().then(res => {

      console.log("res:::",res)
      if (res.data.length == 1) {
      wx.cloud.callFunction({
        name: 'remove',
        data: {
          docid: res.data[0]._id,
          collectionName: 'fileManage'
        },
        success: function (res) {
          console.log(res)
        }, fail: function (res) {
          console.log(res)
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
    wx.cloud.deleteFile({
      fileList: [fId],
      success: res => {
        // handle success
        console.log(res.fileList)
      },
      fail: err => {
        // handle error
      }
    })
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    console.log(options)
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        })
      }
    })
    this.setData({
      courseTeach: app.globalData.courseTeach,
      teacherId: app.globalData.id_for_switch_tab,
      index:options.index
    })
    console.log("获取到的teacherId:", this.data.teacherId)
    console.log("获取到的index:", this.data.index)
    console.log("获取到的courseTeach:", this.data.courseTeach)


    //获取courseDetail 和 FileDetail
    //category必须一致，在manage表中必须对应

    const db = wx.cloud.database();
    const _ = db.command
    
    var tmpIndex = []
    var filed = []
    for(let i = 0; i < this.data.courseTeach.length; i++)
      filed.push([])
    console.log("field:",filed)


      //获取所有通知信息
    db.collection('notice').where({ teacherId: app.globalData.id_for_switch_tab }).orderBy('time', 'desc').get().then(res => {
      this.setData({
        infoDetail:res.data
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







    //获取该教师的全部课件存入fileTmp中
    db.collection('fileManage').where({ teacherId: this.data.teacherId }).get().then(res => {
      this.setData({
        fileTmp: res.data
      })
      for (let i = 0; i < this.data.courseTeach.length; i++) {
        var tmp = []
      //遍历所有符合条件的文件，存入FileDetail中, j该教师的所有上传文件信息
        for (let j = 0; j < this.data.fileTmp.length; j++) {
          db.collection('file').where({ fileId: this.data.fileTmp[j].fileId, category:this.data.courseTeach[i]}).get().then(res => {
            if(res.data.length != 0){
              
              //符合条件就push到数组中
              filed[i].push(res.data[0])
              this.setData({
                fileDetail: filed,
                empty: false,
                isLoad:true
              })
            }
          })
        }
        tmpIndex.push(i)
        this.setData({
          tmpIndex: tmpIndex
        })
      }

    })

    
    var tmpIndex2 = []
    var courses = []
    for (let i = 0; i < this.data.courseTeach.length; i++)
      courses.push([])
    console.log("初始courses：", courses)
    //获取该教师的所有课程到courseTmp
    db.collection('videoManage').where({ teacherId: this.data.teacherId }).get().then(res => {
      this.setData({
        courseTmp: res.data
      })
      console.log("courseTmp：", this.data.courseTmp)
      for (let m = 0; m < this.data.courseTeach.length; m++) {
        //遍历所有符合条件的courseInfo，存入videoDetail中
        for (let n = 0; n < this.data.courseTmp.length; n++) {
          db.collection('course').where({ courseId: this.data.courseTmp[n].courseId, category: this.data.courseTeach[m] }).get().then(res => {
            if (res.data.length != 0) {
              //符合条件就push到数组中
              courses[m].push(res.data[0])
              this.setData({
                isLoad:true,
                courseDetail: courses,
                empty2: false
              })
              for (let i = 0; i < this.data.courseDetail.length; i++) {
                for (let j = 0; j < this.data.courseDetail[i].length; j++) {
                  wx.cloud.getTempFileURL({
                    fileList: [that.data.courseDetail[i][j].imagePath],
                    success: res => {
                      // get temp file URL
                      that.data.courseDetail[i][j].imagePath = res.fileList[0].tempFileURL
                      that.setData({
                        courseDetail: that.data.courseDetail
                      })

                    }
                  })

                }
              }
            }
          })
        }
        tmpIndex2.push(m)
        this.setData({
          tmpIndex2: tmpIndex2
        })
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















  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () 
  {
    



    

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    
    wx.hideLoading()

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