// pages/videoPlay/videoPlay.js
var util = require('../../utils/util.js');
const app = getApp()
function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}


Page({

  /**
   * 页面的初始数据
   */
  inputValue: '',
  data: {
    UserName:"",
    name:"",
    inputValue:"",
    good:false,
    index:0,
    videoDetail:[],
    courseId:"",
    parts:"",
    src: '',
    TabCur:"tab1",
    tab1: true,
    tab2: false,
    clientHeight : 0,
    liuyanlist: [],
    student:false
  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id
    })
  },

  handleChangeScroll({ detail }) 
  {
    var index = detail.key
    this.setData({
      TabCur: detail.key
    })
    if (index == "tab1") {
      this.setData({
        tab1: true,
        tab2: false
      })
    } else if (index == "tab2") {
      this.setData({
        tab1: false,
        tab2: true
      })
    }

  },
  videoCho:function(e)
  {
    console.log(e)
    this.setData({
      index:e.currentTarget.dataset.id
    })

  },

  bindInputBlur: function (e) {
    this.inputValue = e.detail.value
  },
  bindButtonTap: function () {  //视频下载
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: ['front', 'back'],
      success: function (res) {
        that.setData({
          src: res.tempFilePath
        })
      }
    })
  },
  bindSendDanmu: function () {
    this.videoContext.sendDanmu({
      text: this.inputValue,
      color: getRandomColor()
    })
  },
  videoErrorCallback: function (e) {
    console.log('视频错误信息:');
    console.log(e.detail.errMsg);
  },

  playHit:function(e)
  {
      //记录当下时间
      this.setData({
        flag:true,
        start:Date.parse(new Date())
      })
      console.log(this.data.start)
  },

  pauseHit:function(e)
  {
    var that = this
    this.setData({
      end: Date.parse(new Date()),
      flag:false
    })
    console.log((this.data.end- this.data.start)/1000)
    
    //向数据库中写入数据（再向unload中重新写入数据）
    const db =  wx.cloud.database();
    db.collection('history').where({ courseId: that.data.courseId}).get().then(res=>{
        if(res.data.length == 0)
        {
            db.collection('history').add({
              data: {
                courseId: that.data.courseId,
                studentId: app.globalData.id_for_switch_tab,
                lastTime: util.formatTime(new Date),
                time: (that.data.end - that.data.start) / 1000
              },

            })
        }
        else
        { 
          wx.cloud.callFunction({
            name: 'inc',
            data: {
              docid: res.data[0]._id,
              collectionName: 'history',
              field: 'time',
              count: (that.data.end - that.data.start)/1000,
              lastTime: util.formatTime(new Date)
            },
            success: function (res) {
              console.log(res)
            }, fail: function (res) {
              console.log(res)
            }
          })
        }
    })
  },

  endHit:function(e)
  {
    var that = this
    this.setData({
      end: Date.parse(new Date()),
      flag:false
    })
    console.log((this.data.end - this.data.start) / 1000)

    //向数据库中写入数据（再向unload中重新写入数据）
    const db = wx.cloud.database();
    db.collection('history').where({ courseId: that.data.courseId }).get().then(res => {
      if (res.data.length == 0) {
        db.collection('history').add({
          data: {
            courseId: that.data.courseId,
            studentId: app.globalData.id_for_switch_tab,
            lastTime: util.formatTime(new Date),
            time: (that.data.end - that.data.start) / 1000
          },

        })
      }
      else {
        wx.cloud.callFunction({
          name: 'inc',
          data: {
            docid: res.data[0]._id,
            collectionName: 'history',
            field: 'time',
            count: (that.data.end - that.data.start) / 1000,
            lastTime: util.formatTime(new Date)
          },
          success: function (res) {
            console.log(res)
          }, fail: function (res) {
            console.log(res)
          }
        })
      }
    })








  },










  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {


    var that = this;



    

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });


    console.log(option)
    this.setData({
      student:app.globalData.student,
      courseId: option.courseId,
      parts:parseInt(option.parts)
    })
    const db = wx.cloud.database();
    //获取该视频的全部信息
    db.collection('videoManage').where({ courseId: option.courseId }).get().then(res => {
     
      db.collection('teacher').where({teacherId:res.data[0].teacherId}).get().then(res=>{
        this.setData({
          UserName: res.data[0].name,
        })

      })
    })

  if(app.globalData.student){
    db.collection('student').where({ studentId: app.globalData.id_for_switch_tab}).get().then(res => {
      this.setData({
       name: res.data[0].name,
      })
    })
  }







    db.collection('course').where({ courseId:this.data.courseId}).get().then(res => {
      this.setData({
        courseDetail:res.data[0],
        index:0
      })


      wx.cloud.callFunction({
        name: 'update',
        data: {
          docid: that.data.courseDetail._id,
          collectionName: 'course',
          field: 'hot'
        },
        success: function (res) {
          console.log(res)
        }, fail: function (res) {
          console.log(res)
        }
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
    
    //获取集数信息并保存和课时对应
    db.collection('video').where({ courseId: this.data.courseId }).orderBy('part', 'asc').get().then(res => {
      
      this.setData({
        videoDetail: res.data
      })
      console.log(res.data)
      console.log('[数据库][查询] 成功：', res)
    })
      .catch(err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败',
        })
        console.error('[数据库][查询] 失败', err)
      })
    console.log("video页面获取到的courseId:", this.data.courseId)
    console.log("video页面获取到的集数:", this.data.parts)
    
    //在comment表中获取所有留言信息
    db.collection('comment').where({ courseId: this.data.courseId }).orderBy('uploadDate', 'desc').get().then(res => {
      this.setData({
        liuyanlist:res.data
      })
      console.log(res.data)
      console.log('[留言][查询] 成功：', res)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')

  },

  submit: function (e) {
    const db = wx.cloud.database();
    const that = this;
    that.setData({
      info: e.detail.value.txt
    })

    //写入数据库
    db.collection('comment').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        courseId:this.data.courseId,
        content: this.data.info,
        studentId: app.globalData.id_for_switch_tab,
        uploadDate: util.formatTime(new Date),
      },
      success(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
      }
    })

    this.data.liuyanlist.push({ content: this.data.info, uploadDate: util.formatTime(new Date), studentId: app.globalData.id_for_switch_tab})
  that.setData({
    liuyanlist:that.data.liuyanlist
  })
    wx.showToast({
      title: '评论成功！',
      icon: "none",
      duration: 1000,
      mask: true
    })
    this.setData({
      inputValue: ''//将data的inputValue清空
    });
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value//将input至与data中的inputValue绑定
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
    if(this.data.flag)
    {
    var that = this
    this.setData({
      end: Date.parse(new Date())
    })
    console.log((this.data.end - this.data.start) / 1000)

    //向数据库中写入数据（再向unload中重新写入数据）
    const db = wx.cloud.database();
    db.collection('history').where({ courseId: that.data.courseId }).get().then(res => {
      if (res.data.length == 0) {
        db.collection('history').add({
          data: {
            courseId: that.data.courseId,
            studentId: app.globalData.id_for_switch_tab,
            lastTime: util.formatTime(new Date),
            time: (that.data.end - that.data.start) / 1000
          },

        })
      }
      else {
        wx.cloud.callFunction({
          name: 'inc',
          data: {
            docid: res.data[0]._id,
            collectionName: 'history',
            field: 'time',
            count: (that.data.end - that.data.start) / 1000,
            lastTime: util.formatTime(new Date)
          },
          success: function (res) {
            console.log(res)
          }, fail: function (res) {
            console.log(res)
          }
        })
      }
    })
    }
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

    return {

      title: this.data.courseDetail.courseName,

      desc: this.data.courseDetail.info,

      path: '/pages/videoPlay/videoPlay?courseId='+this.data.courseId + "&parts="+this.data.parts
    }

  },

  
  good:function(e)
  {
      //course赞 + 1
      if(!this.data.good)
        wx.showToast({
          title: '点赞成功',
          icon: "none",
          duration: 1000,
        })
        else
        {
        wx.showToast({
          title: '不要重复点赞哦--',
          icon: "none",
          duration: 1000,
        })
        return false;
        }
    this.setData({
      good:true
    })
    wx.cloud.callFunction({
      name: 'update',
      data: {
        docid: this.data.courseDetail._id,
        collectionName: 'course',
        field: 'good'
      },
      success: function (res) {
        console.log(res)
      }, fail: function (res) {
        console.log(res)
      }
    })
  }
})