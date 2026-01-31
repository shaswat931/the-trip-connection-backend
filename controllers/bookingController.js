exports.createBooking = async (req,res)=>{
  console.log(req.body); // data aa raha hai ya nahi
  res.json({ success:true });
};
