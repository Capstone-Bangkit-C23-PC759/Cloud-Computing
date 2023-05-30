module.exports =  function(artifacts, request, h) {
    return {
        isValid: true,
        credentials: { user: artifacts.decoded.payload.userInfo }
    };
};