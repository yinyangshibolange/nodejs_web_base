module.exports = {
    index: ['/api/admin/runchild'],
    service: async (parmas) => {

    },
    send:  (response, params, result, config) => {
        // console.log(request)
        response.writeHead(301, { 'Location': `${response.req.headers["referer"]}?success=${result.success}&message=${urlencode.encode(result.message, 'utf-8')}` });
        return response.end()
    }
}