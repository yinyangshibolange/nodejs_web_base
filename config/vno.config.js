
const config = {
    watch: 'htmls', // 监听文件
    hot: true, // 热监听
    ext: 'ejs', // 拓展名, 多个拓展名以,分割, 如果为空则编译全部文件
    ignores: ["node_modules", "lib", "static", "static_dev", 'datas', ".vercel", '.vscode', 'config'], // 忽略的目录，基于watch目录开始
    includes: [], // 包含的目录，基于watch目录开始
    target: 'static/vnocss/vno.css', // 最终css生成位置, 文件夹需要存在
    cssSplit: false, // 是否每个文件拆分成一个css，可以进一步加快加载速度，如何css不大就没必要，因为每个html导入一个css较为麻烦
    rules: {
        'bg-([0-9a-fA-F]{8})': 'background: #$val[1];',
        'bg-([0-9a-fA-F]{6})': 'background: #$val[1];',
        'bg-([0-9a-fA-F]{3})': 'background: #$val[1];',
        'bg-rgb--(\\d{1,3})-(\\d{1,3})-(\\d{1,3})': 'background: rgb($val[1], $val[2], $val[3]);',
        'bg-rgba-(\\d{1,3} )-(\\d{1,3})-(\\d{1,3})-(\\d+)': m => `background: rgba(${m[1]}, ${m[2]}, ${m[3]}, ${m[4] / 10});`,
        'color-([0-9a-fA-F]{8})': 'color: #$val[1];',
        'color-([0-9a-fA-F]{6})': 'color: #$val[1];',
        'color-([0-9a-fA-F]{3})': 'color: #$val[1];',
        'color-rgb--(\\d{1,3})-(\\d{1,3})-(\\d{1,3})': 'color: rgb($val[1], $val[2], $val[3]);',
        'color-rgba-(\\d{1,3} )-(\\d{1,3})-(\\d{1,3})-(\\d+)': m => `color: rgba(${m[1]}, ${m[2]}, ${m[3]}, ${m[4] / 10});`,
        'w-(\\d+)px': 'width: $val[1]px;',
        'h-(\\d+)px': 'height: $val[1]px;',
        'w-(\\d+)upx': 'width: $val[1]upx;',
        'h-(\\d+)upx': 'height: $val[1]upx;',
        'w-(\\d+)per': 'width: $val[1]%;',
        'h-(\\d+)per': 'height: $val[1]%;',
        'font-(\\d+)px': 'font-size: $val[1]px;',
        'line-(\\d+)px': 'line-height: $val[1]px;',
        'ml-(\\d+)px': 'margin-left: $val[1]px;',
        'mt-(\\d+)px': 'margin-top: $val[1]px;',
        'mr-(\\d+)px': 'margin-right: $val[1]px;',
        'mb-(\\d+)px': 'margin-bottom: $val[1]px;',
        'pd-(\\d+)px-(\\d+)px-(\\d+)px-(\\d+)px': 'padding: $val[1]px $val[2]px $val[3]px $val[4]px;',
        'pd-(\\d+)px-(\\d+)px-(\\d+)px': 'padding: $val[1]px $val[2]px $val[3]px;',
        'pd-(\\d+)px-(\\d+)px': 'padding: $val[1]px $val[2]px;',
        'pd-(\\d+)px': 'padding: $val[1]px;',
        'rd-(\\d+)px': 'border-radius: $val[1]px;',
        'font-(\\d+)upx': 'font-size: $val[1]upx;',
        'line-(\\d+)upx': 'line-height: $val[1]upx;',
        'weight-([0-9a-z]+)': 'font-weight: $val[1];',
        'ml-(\\d+)upx': 'margin-left: $val[1]upx;',
        'mt-(\\d+)upx': 'margin-top: $val[1]upx;',
        'mr-(\\d+)upx': 'margin-right: $val[1]upx;',
        'pd-(\\d+)upx': 'padding: $val[1]upx;',
        'pd-(\\d+)upx-(\\d+)upx': 'padding: $val[1]upx $val[2]upx;',
        'rd-(\\d+)upx': 'border-radius: $val[1]upx;',

        'dis-(.+)_important': 'display: $val[1] !important;',
        'dis-([^_]+)': 'display: $val[1];',
        'ta-(.+)': 'text-align: $val[1];',
        'pos-(.+)': 'position: $val[1];',
        'top-(\\d+)px': 'top: $val[1]px;',
        'left-(\\d+)px': 'left: $val[1]px;',
        'bottom-(\\d+)px': 'bottom: $val[1]px;',
        'right-(\\d+)px': 'right: $val[1]px;',
        'top-(\\d+)upx': 'top: $val[1]upx;',
        'left-(\\d+)upx': 'left: $val[1]upx;',
        'bottom-(\\d+)upx': 'bottom: $val[1]upx;',
        'right-(\\d+)upx': 'right: $val[1]upx;',

        'visibility-(.+)': 'visibility:$val[1];',

        'border-(\\d+)px-([a-zA-Z]+)-([0-9a-fA-F]{8})': 'border: $val[1]px $val[2] #$val[3];',
        'border-(\\d+)px-([a-zA-Z]+)-([0-9a-fA-F]{6})': 'border: $val[1]px $val[2] #$val[3];',
        'border-(\\d+)px-([a-zA-Z]+)-([0-9a-fA-F]{3})': 'border: $val[1]px $val[2] #$val[3];',
    },
}

const borderList = ['top', 'bottom', 'left', 'right']
borderList.forEach(border => {
    config.rules[`border-${border}-(\\d+)px-([a-zA-Z]+)-([0-9a-fA-F]{8})`] = `border-${border}: $val[1]px $val[2] #$val[3];`
    config.rules[`border-${border}-(\\d+)px-([a-zA-Z]+)-([0-9a-fA-F]{6})`] = `border-${border}: $val[1]px $val[2] #$val[3];`
    config.rules[`border-${border}-(\\d+)px-([a-zA-Z]+)-([0-9a-fA-F]{3})`] = `border-${border}: $val[1]px $val[2] #$val[3];`
})

module.exports = config
