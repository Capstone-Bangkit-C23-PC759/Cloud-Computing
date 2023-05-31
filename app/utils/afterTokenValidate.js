module.exports =  function(artifacts, request, h) {
    return {
        isValid: true,
        credentials: artifacts.decoded.payload.userInfo
    };
};