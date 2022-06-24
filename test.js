// const axios = require('axios');

// const API_URL = 'https://churchapp-backend.dcm.my.id'
// const MAIN_GROUP_ID = '627cc6f3ec5d3f7b423377da'

// let token = '';
// let refreshToken = ''

// const test = async () => {
//   await axios.post(`${API_URL}/user/login/`, {
//     'username': 'admin1',
//     'password': 'pass123admin'
//   }, {
//     headers: {
//       'Content-Type': 'application/json',
//     }
//   }).then(resp => {
//       token = resp.data.token,
//       refreshToken = resp.data.refreshToken
//       console.log(token)
//       // console.log(resp.data)
//     })
//     .catch(err => {
//       if (err.code == 'ENOTFOUND') {
//         // console.log({
//         //   data: 'You are offline',
//         //   status: 500
//         // })
//         return
//       }
//       // console.log(err)
//       // console.log({
//       //   data: err.response.data,
//       //   status: err.response.status
//       // })
//     })
  
//   // if (token == null) console.log('WOY')
  
//   await axios.get(`${API_URL}/post/${MAIN_GROUP_ID}/`, {
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`
//     }
//   }).then(resp => {
//       console.log(resp)
//     })
//     .catch(err => {
//       console.log(err)
//       // console.log({
//       //   data: err.response.data,
//       //   status: err.response.status
//       // })
//     })
// }

// test()

const x = {
  a: 5,
  b: 6
}

x.a = 10
x = {
  p: 5,
  q: 6
}
console.log(x)