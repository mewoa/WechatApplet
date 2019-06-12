// pages/uploadCourse/uploadCourse.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: 
  {
    up:false,
    tempFilePaths:"",
    progress:"",
    imgId:"",
    nums:0,
    picker: [],
    teacherId:"",
    imgList: [],
    index:null,
    video:[],
    durations:[],
    courseId:"",
    courseName:"",
    info:"",
    cloudFiles:[],
    textareaAValue:""
  },

  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },


  ChooseVideo() 
  {
    var that = this
    var video = this.data.video
    var du = this.data.durations
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      camera: 'back',
      success(res) {
        var num = that.data.nums
        video.push(res.tempFilePath)
        du.push(res.duration)
        that.setData({
          video: video,
          nums: num + 1,
          durations:du
        })
        console.log(res)
        console.log("video:", that.data.video)
        console.log("nums:",that.data.nums)
      }
    })
    
  },
  
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },

  ChooseImage:function(e)
  { 
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res)
        // tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          up:true,
          tempFilePaths: res.tempFilePaths[0]
        })
  }
  })
  },





  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {

    //1.获取courseId max 并 +1 作为新的id
    var that = this
    const db = wx.cloud.database();
    db.collection("course").orderBy('courseId', 'desc').get().then(res => {
      this.setData({
        courseId: (parseInt(res.data[0].courseId) + 1).toString()
      })
      console.log('courseId成功：', (parseInt(res.data[0].courseId) + 1).toString())
    })



    this.setData({
      teacherId: option.teacherId,
      picker: app.globalData.courseTeach
    })
    console.log("获取到的teacherId:", this.data.teacherId)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () 
  {
    



  },

  submit: function (e)
  {
    




    const db = wx.cloud.database();
    var that = this

    //0.获取name 和 info
    that.setData({
      courseName: e.detail.value.title,
      info: e.detail.value.txt
    })

    //-1 非空判断
    if (this.data.courseName.length == 0 || this.data.info.length == 0 || this.data.index == null || this.data.video.length == 0 || this.data.tempFilePaths == 0)
      {
      wx.showToast({
        title: '请补全必要信息！',
        icon: 'none',
        duration: 2000
      })
      return false
      }

    // //1.获取courseId max 并 +1 作为新的id
    // var that = this
    // const db = wx.cloud.database();
    // db.collection("course").orderBy('courseId', 'desc').get().then(res => {
    //   this.setData({
    //     courseId: parseInt(res.data[0].courseId)
    //   })
    //   console.log('courseId成功：', this.data.courseId)
    // })
  
    //2.上传背景图片
    //上传到云文件，获取fileId,用于换取URL
    var cloudPath = Math.random().toString(36).substr(2, 15) + ".png"
    console.log(cloudPath)
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: this.data.tempFilePaths,
      success: res => {
        that.setData({
          imgId: res.fileID
        })
      
        //写入数据库，写入course、courseManage、video库
        db.collection('course').add({
          // data 字段表示需新增的 JSON 数据
          data: {
            category: this.data.picker[this.data.index],
            courseId: this.data.courseId,
            courseName: this.data.courseName,
            good: 0,
            hot: 0,
            imagePath: this.data.imgId,
            info: this.data.info,
            parts: this.data.nums,
            support: 0
          },
          success(res) {
            // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
            console.log("course Table:", res)
          }
        })
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      },
      fail(res) {
        console.log(res)
      }
    })

    

    db.collection('videoManage').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        courseId: this.data.courseId,
        teacherId: this.data.teacherId
      },
      success(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
      }
    })

    //上传视频获取fileId
    var files = []
    for(let i = 0; i < this.data.video.length; i++)
    {
      wx.cloud.uploadFile({
        cloudPath: 'video/' + Math.random().toString(36).substr(2, 15) + ".mp4",
        filePath: this.data.video[i], // 文件路径
        success: res => {
          // get resource ID
          console.log(res.fileID)
          files.push(res.fileID)
          this.setData({
            cloudFiles:files
          })
          //一个视频上传成功就写入一个video
          db.collection('video').add({
            // data 字段表示需新增的 JSON 数据
            data: {
              courseId: this.data.courseId,
              part: (i + 1).toString(),
              fileId: res.fileID,
              uploadDate: util.formatTime(new Date)
            },
            success(res) {
              // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
              console.log(res)
            }
          })






          console.log("cloudFiles:", files)
        },
        fail: err => {
          // handle error
        }
      })

    }

    //根据fileID写入video表
    // for(let j = 0; j < this.data.video.length; j++)
    // {
    //   db.collection('video').add({
    //     // data 字段表示需新增的 JSON 数据
    //     data: {
    //       courseId: this.data.courseId,
    //       part: (j+1).toString(),
    //       fileId: this.data.cloudFiles[j],
    //       uploadDate: util.formatTime(new Date)
    //     },
    //     success(res) {
    //       // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
    //       console.log(res)
    //     }
    //   })
    // }
    wx.showToast({
      title: '发布成功\n上传任务将在后台进行,请稍后查看...',
      icon: 'none',
      duration: 2000
    })

    setTimeout(function () {
      wx.navigateBack({
        delta: 1
      })
      //要延时执行的代码
    }, 2000)
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