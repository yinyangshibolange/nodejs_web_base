const { stringify , parse } = require('ini') 
const fs = require("fs")
const path = require("path")

async function parseConfig() {
  const fileByte  = await fs.promises.readFile(path.resolve(__dirname, 'config.ini'))
  let data = parse(fileByte.toString())
  console.log(data.MovieID.ignore_whole_word)
  console.log("------------------")

  data= {
    MovieID: {
      ignore_whole_word: '144P;240P;360P;480P;720P;1080P;2K;4K',
      ignore_regex: '\\w+2048\\.com;Carib(beancom)?;[^a-z\\d](f?hd|lt)[^a-z\\d]'
    },
    File:{
      scan_dir: '',
      media_ext: '3gp;avi;f4v;flv;iso;m2ts;m4v;mkv;mov;mp4;mpeg;rm;rmvb;ts;vob;webm;wmv', // 哪些后缀的文件应当视为影片？
      ignore_folder: '#recycle;#整理完成;不要整理', // 扫描影片文件时忽略指定的文件夹（以.开头的文件夹不需要设置也会被忽略）
      ignore_video_file_less_than: '232', // 匹配番号时忽略小于指定大小的文件（以MiB为单位，0表示禁用此功能）
      dir_depth: "1"
    },
    Network:{
      use_proxy: 'no', // 是否启用代理
      proxy: 'http://127.0.0.1:1080', // 设置代理服务器地址，支持 http, socks5/socks5h 代理。
      retry: 3, // 网络问题导致抓取数据失败时的重试次数，通常3次就差不多了
      timeout: 10, // 
    },
    Crawler: {
      required_keys: '',
      hardworking_mode: 'yes',
      respect_site_avid: 'yes',
      fc2fan_local_path: '', 
    }
  }
  console.log(stringify(data))
}
parseConfig()