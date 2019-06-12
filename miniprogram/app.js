//app.js
App({
  /*
  * 小程序启动，onLaunch会被调用,云开发先初始化云功能
  */
 
 // ?
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } 
    else 
    {
      wx.cloud.init({
        traceUser: true,
      })
    }
  //初始化云数据库
    const db = wx.cloud.database();
  },


//dynamic tabBar
globalData: 
{
    id_for_switch_tab: "",
    student:true,
    courseTeach:[]
}
})
