const notfound = (req,res)=>{
    res.status(404).send('<h5>Pege you are requesting is not found</h5>')
}

module.exports = notfound;