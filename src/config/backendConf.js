let backendConf = {
  get url () {
    if (process.env.NODE_ENV === 'production') {
      return '/'
    } else {
      return 'http://127.0.0.1:8000/'
    }
  }
}
export default backendConf
