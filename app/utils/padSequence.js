module.exports=function(sequenceText,max_length){
    const pad = sequenceText.map(function(e) {
        const row_length = e.length 
        if (row_length > max_length){ // truncate
            return e.slice(row_length - max_length, row_length)
        }
        else if (row_length < max_length){ // pad
            return Array(max_length - row_length).fill(0).concat(e);
         }
        return e;
    });
    return pad
}