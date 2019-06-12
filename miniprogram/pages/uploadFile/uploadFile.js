// pages/uploadFile/uploadFile.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teacherName:"",
    up:false,
    tempFilePaths:"",
    index:null,
    picker: [],

    //exl,ppt,word
    HttpImages: ["https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2173544322,400309851&fm=26&gp=0.jpg", "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2079970373,1306716059&fm=26&gp=0.jpg", "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3108661890,3466907668&fm=26&gp=0.jpg","https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3138033735,2412979876&fm=26&gp=0.jpg"]

  },

  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },

  choose:function(e)
  {
    var that = this
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        console.log(res)
        that.setData({
          tempFilePaths:res.tempFiles[0].path,
          up:true
        })
        console.log(that.data.tempFilePaths)
        
        


      }

    })

    

    

  },


//点击上传
  submit: function (e) {
    const that = this;

    //获取用户输入的文件名
    var name = e.detail.value.name
    
    //所属类别
    var cat = this.data.picker[this.data.index]

    //获取文件路径信息并分隔
    var arr = that.data.tempFilePaths.split(".")
    
    //自定义cloudPath
    var cloudPath = "knowledge/" + Math.random().toString(36).substr(2, 15) + "." + arr[arr.length - 1]

    var imagep
    //应当判断文件类型并上传不同的image
    if (arr[arr.length - 1] == "xlsx" )
      imagep = that.data.HttpImages[0]
    else if (arr[arr.length - 1] == "pptx"||arr[arr.length - 1] == "ppt")
      imagep = that.data.HttpImages[1]
    else if (arr[arr.length - 1] == "doc" ||arr[arr.length - 1] == "docx")
    imagep = that.data.HttpImages[2]
    else
    imagep = that.data.HttpImages[3]

    console.log(name)
    console.log(cat)
    console.log(cloudPath)
    console.log(arr)

    if (name.length == 0 || this.data.index == null || this.data.tempFilePaths.length == 0)
    {
      wx.showToast({
        title: '请补全必要信息',
        icon: "none",
        duration: 2000,
        mask: true
      })
      return false

    }




    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: that.data.tempFilePaths,
      success: res => {

        //文件上传成功后写入数据库
        //1.上传到file表
        const db = wx.cloud.database();
        console.log("????",res.fileID)
        db.collection('file').add({
          data: {
            category: cat,
            fileId: res.fileID,
            downloadTimes: 0,
            fileName: name,
            imagePath: imagep,
            teacherName: this.data.teacherName,
            uploadDate: util.formatTime(new Date)
          },
          success: function (res) 
          {
            console.log("成功写入", res)
          },
          fail: function (res) {
            console.log(res)
          }
        })
      //2.上传到fileManage表

        db.collection('fileManage').add({
          data: {
            teacherId: app.globalData.id_for_switch_tab,
            fileId: res.fileID
          },
          success: function (res) {
            console.log("成功写入", res)
          },
          fail: function (res) {
            console.log(res)
          }
        })

        wx.showToast({
          title: '恭喜发布成功!',
          icon: "none",
          duration: 2000,
          mask: true
        })

        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
          //要延时执行的代码
        }, 2000)

        
        //更新记录即可。

        
        
      },
      fail: err => {
        console.log(err)
      }
    })
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) 
  {
    this.setData({
      picker:app.globalData.courseTeach
    })
    const db = wx.cloud.database();
    db.collection('teacher').where({ teacherId: app.globalData.id_for_switch_tab}).get().then(res => {
      this.setData
      ({
        teacherName:res.data[0].name
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
    wx.startPullDownRefresh()

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